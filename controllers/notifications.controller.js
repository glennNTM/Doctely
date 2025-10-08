import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Fonction utilitaire pour déterminer le type de destinataire
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {string|null} Type de destinataire ou null si invalide
 */
const getTypeDestinataire = userRole => {
  switch (userRole) {
    case 'PATIENT':
      return 'PATIENT';
    case 'MEDECIN':
      return 'MEDECIN';
    case 'ADMIN':
      return 'ADMIN';
    default:
      return null;
  }
};

/**
 * @route   GET /api/notifications/me
 * @desc    Récupérer les notifications de l'utilisateur connecté
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    // Récupérer l'ID et le rôle de l'utilisateur connecté depuis le middleware d'authentification
    const userId = req.user.id;
    const userRole = req.user.role;

    // Déterminer le type de destinataire en fonction du rôle de l'utilisateur
    const typeDestinataire = getTypeDestinataire(userRole);
    if (!typeDestinataire) {
      return res.status(400).json({
        success: false,
        message: 'Type d\'utilisateur non reconnu',
      });
    }

    // Récupérer les notifications de l'utilisateur connecté
    const notifications = await prisma.notification.findMany({
      where: {
        destinataireId: userId,
        typeDestinataire,
      },
      orderBy: {
        date: 'desc', // Trier par date décroissante (plus récentes d'abord)
      },
    });

    // Retourner les notifications
    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/notifications/:id/lu
 * @desc    Marquer une notification comme lue
 * @access  Private
 */
export const putNotificationToRead = async (req, res) => {
  try {
    // Récupérer l'ID de la notification depuis les paramètres de la requête
    const notificationId = parseInt(req.params.id);

    // Vérifier que l'ID est un nombre valide
    if (isNaN(notificationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de notification invalide',
      });
    }

    // Récupérer l'ID et le rôle de l'utilisateur connecté
    const userId = req.user.id;
    const userRole = req.user.role;

    // Déterminer le type de destinataire en fonction du rôle de l'utilisateur
    const typeDestinataire = getTypeDestinataire(userRole);
    if (!typeDestinataire) {
      return res.status(400).json({
        success: false,
        message: 'Type d\'utilisateur non reconnu',
      });
    }

    // Vérifier que la notification existe et appartient à l'utilisateur connecté
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        destinataireId: userId,
        typeDestinataire,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée ou vous n\'êtes pas autorisé à y accéder',
      });
    }

    // Mettre à jour la notification pour la marquer comme lue
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        lue: true,
      },
    });

    // Retourner la notification mise à jour
    return res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue',
      data: updatedNotification,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la notification',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Supprimer une notification
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
  try {
    // Récupérer l'ID de la notification depuis les paramètres de la requête
    const notificationId = parseInt(req.params.id);

    // Vérifier que l'ID est un nombre valide
    if (isNaN(notificationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de notification invalide',
      });
    }

    // Récupérer l'ID et le rôle de l'utilisateur connecté
    const userId = req.user.id;
    const userRole = req.user.role;

    // Déterminer le type de destinataire en fonction du rôle de l'utilisateur
    const typeDestinataire = getTypeDestinataire(userRole);
    if (!typeDestinataire) {
      return res.status(400).json({
        success: false,
        message: 'Type d\'utilisateur non reconnu',
      });
    }

    // Vérifier que la notification existe et appartient à l'utilisateur connecté
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        destinataireId: userId,
        typeDestinataire,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée ou vous n\'êtes pas autorisé à y accéder',
      });
    }

    // Supprimer la notification
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    // Retourner une réponse de succès
    return res.status(200).json({
      success: true,
      message: 'Notification supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification',
      error: error.message,
    });
  }
};
