import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/index.js'
import dotenv from 'dotenv';


const prisma = new PrismaClient()
dotenv.config(); // Charge les variables d'environnement

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
        );

        // Stocker le JWT dans un cookie sécurisé
        res.cookie('token', token, {
            httpOnly: true,
            // eslint-disable-next-line no-undef
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en ms
        });

        return res.status(200).json({
            message: 'Connexion réussie',
            token,
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
        res.clearCookie('token', {
            httpOnly: true,
            
        });

        return res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        return res.status(500).json({ message: 'Erreur serveur pendant la déconnexion.' });
    }
};


/**
 * Inscription d’un patient
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, motDePasse, telephone, adresse, date_naissance, genre, groupeSanguin, historique_medical } = req.body

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

        // Création du patient
        const newPatient = await prisma.patient.create({
            data: {
                nom,
                prenom,
                email,
                motDePasse: hashedPassword,
                telephone,
                adresse,
                date_naissance,
                genre,
                groupeSanguin,
                historique_medical
            }
        })
        return res.status(201).json({
            message: 'Inscription réussie',
            patient: {
                id: newPatient.id,
                nom: newPatient.nom,
                prenom: newPatient.prenom,
                email: newPatient.email,
                telephone: newPatient.telephone,
                adresse: newPatient.adresse,
                date_naissance: newPatient.date_naissance,
                genre: newPatient.genre,
                groupeSanguin: newPatient.groupeSanguin,
                historique_medical: newPatient.historique_medical
            }



        })
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        return res.status(500).json({ message: 'Erreur serveur pendant l\'inscription.' });

    }
}