// utils/scheduler.js
import cron from 'node-cron';
import { PrismaClient } from '../generated/prisma/index.js';
import { notifyRdvTime } from './notifications.js';

const prisma = new PrismaClient();

/**
 * Vérifier les RDV qui commencent dans les 5 prochaines minutes
 * Step 1: Chercher les RDV planifiés pour aujourd'hui
 * Step 2: Vérifier si l'heure approche (5 min avant)
 * Step 3: Envoyer les notifications
 */
const checkUpcomingRdv = async () => {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Step 1: Récupérer tous les RDV planifiés pour aujourd'hui
    const todayRdv = await prisma.rendezvous.findMany({
      where: {
        statut: 'PLANIFIE',
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        patient: true,
        medecin: true,
      },
    });

    // Step 2: Vérifier chaque RDV pour voir s'il commence bientôt
    for (const rdv of todayRdv) {
      // Construire la date/heure exacte du RDV
      const [heures, minutes] = rdv.heure.split(':').map(Number);
      const rdvDateTime = new Date(rdv.date);
      rdvDateTime.setHours(heures, minutes, 0, 0);

      // Calculer la différence en minutes
      const timeDiffMs = rdvDateTime.getTime() - now.getTime();
      const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));

      // Step 3: Si le RDV commence dans 5 minutes exactement
      if (timeDiffMinutes === 5) {
        console.log(`RDV imminent détecté: #${rdv.id} dans 5 minutes`);

        // SCENARIO 3 - Notifier patient et médecin
        await notifyRdvTime(rdv, rdv.patient, rdv.medecin);
      }
    }
  } catch (error) {
    console.error('Erreur vérification RDV:', error);

    // Tentative de reconnexion si erreur de connexion
    if (error.code === 'P1001' || error.message.includes('Can\'t reach database')) {
      console.log('Tentative de reconnexion à la base de données...');
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        console.log('Reconnexion réussie');
      } catch (reconnectError) {
        console.error('Échec de la reconnexion:', reconnectError.message);
      }
    }
  } finally {
    // S'assurer que la connexion est fermée proprement
    await prisma.$disconnect();
  }
};

/**
 * Initialiser le planificateur automatique
 * Vérifie chaque minute s'il y a des RDV imminents
 */
export const initScheduler = () => {
  // Tâche cron : vérifier chaque minute (* * * * *)
  cron.schedule('* * * * *', () => {
    console.log('Vérification des RDV imminents (toutes les 1 minute)...');
    checkUpcomingRdv();
  });

  console.log('Planificateur de RDV initialisé - vérification chaque minute');
};
