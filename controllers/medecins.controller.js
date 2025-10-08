import bcrypt from 'bcryptjs';
import { PrismaClient, Specialite } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * @route   GET /api/medecins
 * @desc    Récupère tous les medecins depuis la base de données
 * @access  medecin uniquement
 */
export const getMedecins = async (req, res) => {
  try {
    // 🔍 Requête à la base de données pour récupérer tous les medecins
    const medecins = await prisma.medecin.findMany();

    // ✅ Si des medecins sont trouvés, les retourner avec un code HTTP 200
    return res.status(200).json({
      success: true,
      count: medecins.length,
      data: medecins,
    });
  } catch (error) {
    // ❌ En cas d'erreur, afficher dans la console pour le debug
    console.error('Erreur GET /api/medecins :', error);

    // 🛑 Renvoyer une réponse d'erreur au client
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de récupérer les medecins.',
    });
  }
};

/**
 * @route   GET /api/medecins/:id
 * @param   {string} id - ID du medecin à récupérer
 * @desc    Récupère un medecin spécifique par son ID
 * @access  Admin et médecin uniquement
 */
export const getMedecinById = async (req, res) => {
  try {
    // Recupération de l'ID depuis les paramètres d'URL et conversion en entier
    const medecinId = parseInt(req.params.id, 10);
    // Vérification de la présence de l'ID
    if (!medecinId) {
      return res.status(400).json({
        success: false,
        message: 'ID du médecin manquant.',
      });
    }
    // Recherche du médecin dans la base de données via Prisma
    const medecin = await prisma.medecin.findUnique({
      where: { id: medecinId },
    });
    // ❌ Si le médecin n'est pas trouvé
    if (!medecin) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé.',
      });
    }
    // ✅ Si le médecin est trouvé, le retourner avec un code HTTP 200
    return res.status(200).json({
      success: true,
      data: medecin,
    });
  } catch (error) {
    console.error('Erreur GET /api/medecins/:id :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de récupérer le médecin.',
    });
  }
};

/**
 * @route   POST /api/medecins
 * @desc    Crée un nouveau médecin
 * @access  Admin uniquement
 */
export const createMedecin = async (req, res) => {
  try {
    // Récupération des données du corps de la requête
    const { nom, prenom, email, motDePasse, telephone, specialite, certificat, adresse } = req.body;

    //On verifie que tous les champs requis sont présents
    if (!nom || !prenom || !email || !motDePasse || !specialite || !certificat) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, prénom, email, mot de passe, spécialité et certificat sont obligatoires.',
      });
    }
    // Vérifie si la spécialité est valide (en fonction de l'enum)
    if (!Object.values(Specialite).includes(specialite)) {
      return res.status(400).json({
        success: false,
        message: `Spécialité invalide. Valeurs autorisées : ${Object.values(Specialite).join(', ')}`,
      });
    }

    // Vérification de l'existence d'un médecin avec le même email
    const existingMedecin = await prisma.medecin.findUnique({ where: { email } });
    if (existingMedecin) {
      return res.status(400).json({
        success: false,
        message: 'Un médecin avec cet email existe déjà.',
      });
    }

    // Hashe du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    //Creation du médecin dans la base de données
    const newMedecin = await prisma.medecin.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        telephone,
        specialite,
        certificat,
        adresse,
        dateCreation: new Date(),
      },
    });

    // Réponse avec les détails du médecin créé
    return res.status(201).json({
      success: true,
      data: newMedecin,
    });
  } catch (error) {
    console.error('Erreur POST /api/medecins :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de créer le médecin.',
    });
  }
};

/**
 * @route   DELETE /api/medecins/:id
 * @param   {string} id - ID du medecin à récupérer
 * @desc    Supprime un medecin spécifique par son ID
 * @access  Admin uniquement
 */
export const deleteMedecin = async (req, res) => {
  try {
    // Récupération de l'ID depuis les paramètres d'URL et conversion en entier
    const medecinId = parseInt(req.params.id, 10);

    // Vérification de la présence de l'ID
    if (!medecinId) {
      return res.status(400).json({
        success: false,
        message: 'ID du médecin manquant.',
      });
    }

    // Recherche du médecin dans la base de données via Prisma
    const medecin = await prisma.medecin.findUnique({
      where: { id: medecinId },
    });

    // ❌ Si le médecin n'est pas trouvé
    if (!medecin) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé.',
      });
    }

    // Suppression du médecin
    await prisma.medecin.delete({
      where: { id: medecinId },
    });

    // ✅ Réponse de succès après suppression
    return res.status(200).json({
      success: true,
      message: 'Médecin supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur DELETE /api/medecins/:id :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de supprimer le médecin.',
    });
  }
};

/**
 * @route   GET /api/medecins?specialite=XXX
 * @desc    Récupère les médecins par spécialité (filtre)
 * @access  Admin uniquement
 */
export const getMedecinsBySpecialite = async (req, res) => {};
