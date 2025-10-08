import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * @route   GET /api/admins
 * @desc    Récupère tous les admins depuis la base de données
 * @access  Admin uniquement
 */
export const getAdmins = async (req, res) => {
  try {
    // 🔍 Requête à la base de données pour récupérer tous les admins
    const admins = await prisma.admin.findMany();

    // ✅ Si des admins sont trouvés, les retourner avec un code HTTP 200
    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    // ❌ En cas d'erreur, afficher dans la console pour le debug
    console.error('Erreur GET /api/admins :', error);

    // 🛑 Renvoyer une réponse d'erreur au client
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de récupérer les admins.',
    });
  }
};

/**
 * @route   POST /api/admins
 * @desc    Crée un nouvel administrateur
 * @access  Admin uniquement
 */
export const createAdmin = async (req, res) => {
  try {
    // Récupération des données du corps de la requête
    const { nom, prenom, email, motDePasse, telephone, adresse } = req.body;

    //On verifie que tous les champs requis sont présents
    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, prénom, email et mot de passe sont obligatoires.',
      });
    }
    // Vérification de l'existence d'un administrateur avec le même email
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un administrateur avec cet email existe déjà.',
      });
    }
    // Hashe du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Création de l'administrateur dans la base de données
    const newAdmin = await prisma.admin.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword, // Note: Assurez-vous de hasher le mot de passe avant de le stocker
        telephone,
        adresse,
        dateCreation: new Date(), // Date de création
      },
    });
    // Réponse avec les détails de l'administrateur créé
    return res.status(201).json({
      success: true,
      data: newAdmin,
    });
  } catch (error) {
    console.error('Erreur POST /api/admins :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de créer l\'administrateur.',
    });
  }
};

/**
 * @route   DELETE /api/admins
 * @desc    Supprimer un nouvel administrateur
 * @access  Admin uniquement
 */
export const deleteAdmin = async (req, res) => {
  try {
    // ✅ Récupération de l'ID depuis les paramètres d'URL et conversion en entier
    const adminId = parseInt(req.params.id, 10);

    // 🔍 Vérification de la présence de l'ID
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'ID du admin manquant.',
      });
    }

    // 🔍 Recherche du admin dans la base de données via Prisma
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    // ❌ Si le admin n'est pas trouvé
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'admin non trouvé.',
      });
    }
    // 🗑️ Suppression du admin de la base de données
    await prisma.admin.delete({
      where: { id: adminId },
    });

    // ✅ admin supprimé, on retourne une réponse
    return res.status(200).json({
      success: true,
      message: 'admin supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur DELETE /api/admins/:id :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de supprimer le admin.',
    });
  }
};
