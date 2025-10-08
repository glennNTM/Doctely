import { PrismaClient, Specialite } from '../generated/prisma/index.js';
import { notifyMedecinsNewDemande, notifyPatientDemandeAccepted } from '../utils/notifications.js';

const prisma = new PrismaClient();

/**
 * @route   POST /api/demande-consultation
 * @desc    Soumettre une demande de consultation
 * @access  Patient uniquement
 */
export const submitConsultation = async (req, res) => {
  try {
    // Récupération des données du corps de la requête
    const { specialite, motif } = req.body;

    // On verifie si tous les champs requis sont remplis
    if (!specialite || !motif) {
      return res.status(400).json({
        success: false,
        message: 'Les champs spécialité et motif sont obligatoires.',
      });
    }
    // On verifie si la specialiete est valide
    const specialitesEnum = Object.values(Specialite);
    if (!specialitesEnum.includes(specialite)) {
      return res.status(400).json({ message: 'Spécialité invalide.' });
    }
    // Step 1: Récupérer les infos du patient pour les notifications
    const patient = await prisma.patient.findUnique({
      where: { id: req.user.id },
      select: { prenom: true, nom: true },
    });

    // Step 2: Enregistrer la demande de consultation en base
    const newConsultation = await prisma.demandeConsultation.create({
      data: {
        patientId: req.user.id,
        specialite,
        motif,
        statut: 'EN_ATTENTE',
      },
    });

    // Step 3: SCENARIO 1 - Notifier tous les médecins de cette spécialité
    const patientName = `${patient.prenom} ${patient.nom}`;
    await notifyMedecinsNewDemande(specialite, patientName, newConsultation.id);

    return res.status(201).json({
      success: true,
      data: newConsultation,
    });
  } catch (error) {
    console.error('Erreur POST /api/demande-consultation :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Impossible de soumettre la demande de consultation.',
    });
  }
};

/**
 * @route   GET /api/demande-consultation/medecin/me
 * @desc   Récupérer toutes les demandes de consultation correspondant à la spécialité du médecin connecté
 * @access  Medecin uniquement
 * @filter  Seules les demandes avec statut: 'EN_ATTENTE' et correspondant à la spécialité du médecin
 */
export const getMedecinConsultations = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Seuls les médecins peuvent accéder à cette ressource.',
      });
    }

    const medecin = await prisma.medecin.findUnique({
      where: { id: user.id },
    });

    if (!medecin) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé.',
      });
    }

    const consultations = await prisma.demandeConsultation.findMany({
      where: {
        statut: 'EN_ATTENTE',
        specialite: medecin.specialite,
      },
      include: { patient: true },
    });

    return res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des consultations :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des consultations.',
    });
  }
};

/**
 * @route   GET /api/demande-consultation/patient/me
 * @desc   Récupérer toutes les demandes de consultation du patient  connecté
 * @access  Patient uniquement
 */
export const getConsultations = async (req, res) => {
  try {
    const user = req.user;
    // Vérifie que l'utilisateur est bien un patient
    if (!user || user.role !== 'PATIENT') {
      return res.status(403).json({
        error: 'Accès interdit. Seuls les patients peuvent accéder à cette ressource.',
      });
    }

    // Récupère les demandes de consultation du patient
    const consultations = await prisma.demandeConsultation.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        medecin: true,
      },
    });

    return res.status(200).json(consultations);
  } catch (error) {
    console.error('Erreur lors de la récupération des consultations :', error);
    return res.status(500).json({
      error: 'Erreur serveur lors de la récupération des consultations.',
    });
  }
};

/**
 * @route   PUT /api/demande-consultation/:id/accept
 * @desc    Accepter une demande de consultation
 * @access  Medecin uniquement
 */
export const acceptConsultation = async (req, res) => {
  try {
    const user = req.user;
    const demandeId = parseInt(req.params.id, 10);

    // Vérifie si l'utilisateur est un médecin
    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({
        error: 'Accès interdit. Seuls les médecins peuvent effectuer cette action.',
      });
    }

    // Récupère le médecin connecté
    const medecin = await prisma.medecin.findUnique({ where: { id: user.id } });
    if (!medecin) {
      return res.status(404).json({ error: 'Médecin non trouvé.' });
    }

    // Récupère la demande
    const demande = await prisma.demandeConsultation.findUnique({
      where: { id: demandeId },
    });
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }

    // Vérifie que la spécialité correspond
    if (demande.specialite !== medecin.specialite) {
      return res.status(403).json({
        error: 'Vous ne pouvez accepter que les demandes correspondant à votre spécialité.',
      });
    }

    // Vérifie que la demande est en attente
    if (demande.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: 'Cette demande a déjà été traitée.' });
    }

    // Step 1: Mise à jour de la demande en base
    const updatedDemande = await prisma.demandeConsultation.update({
      where: { id: demandeId },
      data: {
        statut: 'ACCEPTE',
        medecinId: medecin.id,
      },
    });

    // Step 2: SCENARIO 2 - Notifier le patient de l'acceptation
    const medecinName = `${medecin.prenom} ${medecin.nom}`;
    await notifyPatientDemandeAccepted(updatedDemande.patientId, medecinName, updatedDemande.specialite);

    return res.status(200).json(updatedDemande);
  } catch (error) {
    console.error('Erreur lors de l\'acceptation :', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * @route   POST /api/demande-consultation/:id/delete
 * @desc    Refuser une demande de consultation
 * @access  Medecin uniquement
 */
export const deleteConsultation = async (req, res) => {
  try {
    // Récupération de l'ID de la demande depuis les paramètres de la requête
    const user = req.user;
    const demandeId = parseInt(req.params.id, 10);
    // Vérifie si l'utilisateur est un médecin
    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({
        error: 'Accès interdit. Seuls les médecins peuvent effectuer cette action.',
      });
    }
    // Récupération du médecin connecté
    const medecin = await prisma.medecin.findUnique({ where: { id: user.id } });
    if (!medecin) {
      return res.status(404).json({ error: 'Médecin non trouvé.' });
    }
    // Vérifie si la demande existe
    // Récupération de la demande
    const demande = await prisma.demandeConsultation.findUnique({
      where: { id: demandeId },
    });
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }

    if (demande.specialite !== medecin.specialite) {
      return res.status(403).json({
        error: 'Vous ne pouvez refuser que les demandes correspondant à votre spécialité.',
      });
    }
    // Suppression de la demande
    await prisma.demandeConsultation.delete({
      where: { id: demandeId },
    });

    // Retourne une réponse de succès
    return res.status(200, {
      success: true,
      message: 'Demande de consultation supprimée avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
