import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../generated/prisma/index.js'
import dotenv from 'dotenv'


const prisma = new PrismaClient()
dotenv.config() // Charge les variables d'environnement

/**
 * Connexion d’un utilisateur (patient, médecin ou admin)
 * @route POST /api/auth/login
 * @access Public
 */
export const logIn = async (req, res) => {
    const { email, motDePasse, role } = req.body;

    // eslint-disable-next-line no-undef
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error('❌ JWT_SECRET non défini dans .env');
        return res.status(500).json({ message: 'Erreur serveur : configuration manquante.' });
    }

    if (!email || !motDePasse || !role) {
        return res.status(400).json({ message: 'Email, mot de passe et rôle requis.' });
    }

    try {
        let utilisateur;

        switch (role) {
            case 'PATIENT':
                utilisateur = await prisma.patient.findUnique({ where: { email } });
                break;
            case 'MEDECIN':
                utilisateur = await prisma.medecin.findUnique({ where: { email } });
                break;
            case 'ADMIN':
                utilisateur = await prisma.admin.findUnique({ where: { email } });
                break;
            default:
                return res.status(400).json({ message: 'Rôle invalide.' });
        }

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Créer le JWT
        const token = jwt.sign(
            {
                id: utilisateur.id,
                email: utilisateur.email,
                role,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )
        // Le token sera stocke dans le local storage

        return res.status(200).json({
            message: 'Connexion réussie',
            token, // à stocker dans localStorage côté frontend
            utilisateur: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ message: 'Erreur serveur pendant la connexion.' });
    }
}

/**
 * Déconnexion de l'utilisateur
 * @route POST /api/auth/logout
 * @access Public
 */
export const logOut = async (req, res) => {
    try {
        // Ici, on ne peut pas "forcer" la suppression du token du localStorage depuis le backend
        return res.status(200).json({ message: 'Déconnexion réussie. Supprimez le token côté client.' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        return res.status(500).json({ message: 'Erreur serveur pendant la déconnexion.' });
    }
}



/**
 * Inscription d’un patient
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
    console.log("--- [BACKEND] Début du contrôleur register ---");
    try {
        // On s'attend à recevoir les champs en camelCase depuis le frontend
        console.log("Corps de la requête reçu:", req.body);
        const { nom, prenom, email, motDePasse, telephone, adresse, dateNaissance, genre, groupeSanguin, historiqueMedical } = req.body

        // Vérification des champs requis
        if (!nom || !prenom || !email || !motDePasse) {
            return res.status(400).json({ message: 'Nom, prénom, email et mot de passe sont requis.' });
        }

        // Vérification de l'existence du patient
        const existingPatient = await prisma.patient.findUnique({ where: { email } })
        if (existingPatient) {
            return res.status(409).json({ message: 'Un patient avec cet email existe déjà.' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10)
        console.log("Mot de passe hashé.");

        const dataToCreate = {
            nom,
            prenom,
            email,
            motDePasse: hashedPassword,
            telephone,
            adresse,
            // On s'assure que le nom du champ correspond au schéma Prisma (camelCase)
            dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
            genre,
            groupeSanguin,
            historiqueMedical
        };

        console.log("Données envoyées à Prisma pour création:", dataToCreate);
        
        // Création du patient
        const newPatient = await prisma.patient.create({
            data: dataToCreate
        })

        console.log("Patient créé avec succès. ID:", newPatient.id);

        return res.status(201).json({
            message: 'Inscription réussie',
            patient: {
                id: newPatient.id,
                nom: newPatient.nom,
                prenom: newPatient.prenom,
                email: newPatient.email,
                telephone: newPatient.telephone,
                adresse: newPatient.adresse,
                dateNaissance: newPatient.dateNaissance,
                genre: newPatient.genre,
                groupeSanguin: newPatient.groupeSanguin,
                historiqueMedical: newPatient.historiqueMedical
            }



        })
    } catch (error) {
        console.error('--- [BACKEND] ERREUR DANS LE BLOC CATCH DU CONTRÔLEUR REGISTER ---');
        console.error('Erreur détaillée:', error);
        
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Erreur serveur pendant l\'inscription.', error: error.message });
        }

    }
}

/**
 * @desc    Récupérer les infos du profil de l'utilisateur connecté (Patient, Médecin ou Admin)
 * @route   GET /api/auth/me
 * @access  Privé
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.role || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Jeton invalide ou informations manquantes.',
      });
    }

    let userInDb = null;

    switch (user.role) {
      case 'PATIENT':
        userInDb = await prisma.patient.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            adresse: true,
            genre: true,
            groupeSanguin: true,
            historiqueMedical: true,
            dateNaissance: true,
            telephone: true,
          },
        })
        break;

      case 'MEDECIN':
        userInDb = await prisma.medecin.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            adresse: true,
            specialite: true,
            telephone: true,
          },
        })
        break;

      case 'ADMIN':
        userInDb = await prisma.admin.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
            adresse: true,
          },
        })
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Rôle utilisateur inconnu.',
        })
    }

    if (!userInDb) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.',
      });
    }

    res.status(200).json({
      success: true,
      data: { role: user.role, ...userInDb },
    });
  } catch (error) {
    console.error('Erreur dans GET /me :', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'utilisateur.",
    });
  }
}