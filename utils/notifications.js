// utils/notifications.js
import { PrismaClient } from '../generated/prisma/index.js';
import { getIO } from '../config/socket.js';

const prisma = new PrismaClient();

/**
 * Fonction principale pour créer et envoyer une notification
 * Step 1: Sauvegarde en base de données
 * Step 2: Envoi en temps réel via Socket.IO
 */
export const createAndSendNotification = async ({ destinataireId, typeDestinataire, type, contenu }) => {
  try {
    // Step 1: Créer la notification en base
    const notification = await prisma.notification.create({
      data: {
        destinataireId,
        typeDestinataire,
        type,
        contenu,
        lue: false,
      },
    });

    // Step 2: Envoyer en temps réel via Socket.IO
    const io = getIO();
    io.to(destinataireId.toString()).emit('nouvelle_notification', {
      id: notification.id,
      type: notification.type,
      contenu: notification.contenu,
      date: notification.date,
      lue: notification.lue,
    });

    console.log(`Notification envoyée à l'utilisateur ${destinataireId}`);
    return notification;
  } catch (error) {
    console.error('Erreur notification:', error);
    throw error;
  }
};

/**
 * SCENARIO 1: Notifier tous les médecins d'une spécialité
 * Quand un patient fait une demande de consultation
 */
export const notifyMedecinsNewDemande = async (specialite, patientName, demandeId) => {
  try {
    // Step 1: Récupérer tous les médecins de cette spécialité
    const medecins = await prisma.medecin.findMany({
      where: { specialite },
    });

    // Step 2: Créer et envoyer une notification à chaque médecin
    const notifications = medecins.map(medecin =>
      createAndSendNotification({
        destinataireId: medecin.id,
        typeDestinataire: 'MEDECIN',
        type: 'NOUVELLE_DEMANDE',
        contenu: `Nouvelle demande de consultation de ${patientName} pour ${specialite.toLowerCase()}.`,
      })
    );

    await Promise.all(notifications);
    console.log(`${medecins.length} médecins ${specialite} notifiés`);
  } catch (error) {
    console.error('Erreur notification médecins:', error);
  }
};

/**
 * SCENARIO 2: Notifier le patient que sa demande est acceptée
 * Quand un médecin valide la demande
 */
export const notifyPatientDemandeAccepted = async (patientId, medecinName, specialite) => {
  try {
    await createAndSendNotification({
      destinataireId: patientId,
      typeDestinataire: 'PATIENT',
      type: 'DEMANDE_ACCEPTEE',
      contenu: `Bonne nouvelle ! Le Dr. ${medecinName} a accepté votre demande de consultation pour ${specialite.toLowerCase()}.`,
    });
  } catch (error) {
    console.error('Erreur notification acceptation:', error);
  }
};

/**
 * SCENARIO 3: Notifier patient et médecin que le RDV commence
 * Quand l'heure du RDV arrive
 */
export const notifyRdvTime = async (rdv, patient, medecin) => {
  try {
    // Step 1: Notification au patient
    await createAndSendNotification({
      destinataireId: rdv.patientId,
      typeDestinataire: 'PATIENT',
      type: 'RDV_IMMINENT',
      contenu: `Votre rendez-vous avec le Dr. ${medecin.prenom} ${medecin.nom} commence maintenant !`,
    });

    // Step 2: Notification au médecin
    await createAndSendNotification({
      destinataireId: rdv.medecinId,
      typeDestinataire: 'MEDECIN',
      type: 'RDV_IMMINENT',
      contenu: `Votre rendez-vous avec ${patient.prenom} ${patient.nom} commence maintenant !`,
    });

    // Step 3: Événement spécial pour ouvrir la room automatiquement
    const io = getIO();

    // Signal spécial au patient
    io.to(rdv.patientId.toString()).emit('rdv_ready', {
      rdvId: rdv.id,
      message: 'Rejoignez votre consultation',
      action: 'join_room',
    });

    // Signal spécial au médecin
    io.to(rdv.medecinId.toString()).emit('rdv_ready', {
      rdvId: rdv.id,
      message: 'Rejoignez votre consultation',
      action: 'join_room',
    });

    console.log(`Notifications RDV envoyées pour le rendez-vous #${rdv.id}`);
  } catch (error) {
    console.error('Erreur notification RDV:', error);
  }
};
