import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

/**
 * @route   POST /api/rendez-vous
 * @desc    Créer un nouveau rendez-vous (le médecin connecté est automatiquement associé)
 * @access  Privé - Medecin uniquement
 */
export const createRdv = async (req, res) => {
  try {
    // 1️⃣ Récupérer l'ID du médecin connecté (injecté via le middleware d'authentification)
    const medecinId = req.user.id;

    // 2️⃣ Vérifier si ce médecin existe et récupérer ses infos
    const medecin = await prisma.medecin.findUnique({
      where: { id: medecinId },
    })

    if (!medecin) {
      return res.status(404).json({ message: "Médecin non trouvé." });
    }

    // 3️⃣ Récupérer les données envoyées dans le corps de la requête
    const {
      patientId,
      date, // Format: 2025-07-25T14:30:00.000Z
      heure,
      motif,
      type,
      demandeId,
    } = req.body

    // 4️⃣ Validation des champs obligatoires
    if (!patientId || !date || !heure || !motif) {
      return res.status(400).json({
        message: "Veuillez fournir patientId, date, heure et motif.",
      })
    }

    // 5️⃣ Créer le rendez-vous avec la spécialité automatiquement ajoutée
    const rendezVous = await prisma.rendezvous.create({
      data: {
        patientId,
        medecinId,
        date,
        heure,
        motif,
        specialite: medecin.specialite, // 🧠 On récupère la spécialité du médecin connecté
        type,
        demandeId: demandeId || null,   // Peut être null si pas de lien avec une demande
      },
    })

    // 6️⃣ Retourner le rendez-vous créé
    res.status(201).json({
      message: "Rendez-vous créé avec succès.",
      rendezVous,
    })

  } catch (error) {
    console.error("Erreur création rendez-vous:", error);
    res.status(500).json({ message: "Erreur serveur lors de la création du rendez-vous." });
  }
}


/**
 * @route   GET /api/rendez-vous
 * @desc    Récupérer tous les rendez-vous
 * @access  Admin uniquement
 */
export const getRdv = async (req, res) => {
  try {
    // Requete a la base de donnees pour recuperer tous les rdvs
    const rdvs = await prisma.rendezvous.findMany()

    // On retourne les rendez-vous
    return res.status(200).json({
      success: true,
      count: rdvs.length,
      data: rdvs,
    })
  } catch (error) {
    console.error('Erreur GET /api/rendez-vous :', error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur. Impossible de récupérer les rendez-vous.",
    })

  }
}


/**
 * @route   GET /api/rendez-vous?statut=XXX
 * @desc    Récupérer tous les rendez-vous selon le statut
 * @access  Medecin et Patient uniquement
 */
export const getRdvByStatut = async (req, res) => {
  try {
    const { statut } = req.query;
    const user = req.user;

    if (!statut || !['PLANIFIE', 'REALISE', 'ANNULE'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide ou manquant.' });
    }

    let rendezvous = [];

    // Vérifie le rôle pour filtrer les RDVs selon l'utilisateur
    if (user.role === 'MEDECIN') {
      rendezvous = await prisma.rendezvous.findMany({
        where: {
          medecinId: user.id,
          statut: statut,
        },
        include: {
          patient: true,
          demande: true,
        },
      });
    } else if (user.role === 'PATIENT') {
      rendezvous = await prisma.rendezvous.findMany({
        where: {
          patientId: user.id,
          statut: statut,
        },
        include: {
          medecin: true,
          demande: true,
        },
      });
    } else {
      return res.status(403).json({ error: 'Accès interdit.' });
    }

    res.json(rendezvous);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
  }
}



/**
 * @route   GET /api/rendez-vous/patient/me
 * @desc    Récupérer tous les rendez-vous du patient connecté
 * @access  Patient authentifié
 */
export const getRdvByPatient = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'PATIENT') {
      return res.status(403).json({ error: 'Accès réservé aux patients.' });
    }

    const rendezvous = await prisma.rendezvous.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        medecin: true,
        demande: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(rendezvous);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous du patient." });
  }
}


/**
 * @route   GET /api/rendez-vous/medecin/me
 * @desc    Récupérer tous les rendez-vous du médecin connecté
 * @access  Médecin authentifié
 */
export const getRdvByMedecin = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'MEDECIN') {
      return res.status(403).json({ error: 'Accès réservé aux médecins.' });
    }

    const rendezvous = await prisma.rendezvous.findMany({
      where: {
        medecinId: user.id,
      },
      include: {
        patient: true,
        demande: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(rendezvous);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous du médecin." });
  }
}

/**
 * @route   PUT /api/rendez-vous/:id/cancel
 * @desc    Annuler un rendez-vous
 * @access  Médecin authentifié
 */
export const cancelRdv = async (req, res) => {
  const { id } = req.params;
  const medecinConnecteId = req.user?.id; // Assure-toi que le middleware d'auth ajoute `req.user`

  try {
    // Vérifier que l'ID est bien un entier
    const rdvId = parseInt(id, 10)
    if (isNaN(rdvId)) {
      return res.status(400).json({ error: "ID de rendez-vous invalide." });
    }

    // Rechercher le rendez-vous
    const rdv = await prisma.rendezvous.findUnique({
      where: { id: rdvId },
    })

    if (!rdv) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    // Vérifier que le médecin connecté est bien celui du rendez-vous
    if (rdv.medecinId !== medecinConnecteId) {
      return res.status(403).json({ error: "Accès refusé à ce rendez-vous." });
    }

    // Mettre à jour le statut du rendez-vous à ANNULE
    const rdvAnnule = await prisma.rendezvous.update({
      where: { id: rdvId },
      data: { statut: "ANNULE" },
    })

    return res.status(200).json({
      message: "Rendez-vous annulé avec succès.",
      rendezvous: rdvAnnule,
    })
  } catch (error) {
    console.error("Erreur lors de l’annulation du rendez-vous :", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de l’annulation du rendez-vous.",
    })
  }
}



/**
 * @route   POST /api/rendez-vous/:id/video
 * @desc    Creer une salle video pour la teleconsultation
 * @access  Medecin-only
 */
export const createRdvVideo = async (req, res) => { }


/**
 * @route   GET /api/rendez-vous/:id/video
 * @desc    Rejoindre une salle video pour la teleconsultation
 * @access  Patient & Medecin-only
 */
export const joinRdvVideo = async (req, res) => { }