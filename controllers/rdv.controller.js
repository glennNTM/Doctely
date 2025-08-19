import { PrismaClient } from '../generated/prisma/index.js'
import axios from 'axios'

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
 * @desc    Créer une salle vidéo pour la téléconsultation
 * @access  Medecin-only
 */
export const createRdvVideo = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== "MEDECIN") {
      return res.status(403).json({ success: false, message: "Accès interdit" });
    }

    // Vérifier que le rendez-vous existe
    const rdv = await prisma.rendezvous.findUnique({
      where: { id },
      include: { patient: true, medecin: true },
    });

    if (!rdv) {
      return res.status(404).json({ success: false, message: "Rendez-vous introuvable" });
    }

    // Créer une salle Daily.co
    const response = await axios.post(
      `${process.env.DAILY_API_URL}/rooms`,
      {
        name: `rdv-${id}-${Date.now()}`, // nom unique
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // expire après 1h
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Sauvegarde de l’URL dans la DB
    const updatedRdv = await prisma.rendezVous.update({
      where: { id },
      data: { videoUrl: response.data.url },
    });

    return res.status(201).json({
      success: true,
      message: "Salle vidéo créée avec succès",
      url: response.data.url,
      rdv: updatedRdv,
    });
  } catch (error) {
    console.error("Erreur Daily.co :", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de la création de la salle vidéo" });
  }
};

/**
 * @route   GET /api/rendez-vous/:id/video
 * @desc    Rejoindre une salle vidéo pour la téléconsultation
 * @access  Patient & Médecin-only
 */
export const joinRdvVideo = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || !["PATIENT", "MEDECIN"].includes(user.role)) {
      return res.status(403).json({ success: false, message: "Accès interdit" });
    }

    // Vérifier que le RDV existe et qu'il a une salle
    const rdv = await prisma.rendezvous.findUnique({
      where: { id },
    });

    if (!rdv || !rdv.videoUrl) {
      return res.status(404).json({ success: false, message: "Salle vidéo introuvable pour ce rendez-vous" });
    }

    // Générer un token d’accès pour la salle Daily.co
    const response = await axios.post(
      `${process.env.DAILY_API_URL}/meeting-tokens`,
      {
        properties: {
          room_name: rdv.videoUrl.split("/").pop(), // récupère le nom de la salle
          user_name: `${user.prenom} ${user.nom}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      url: rdv.videoUrl,
      token: response.data.token,
    });
  } catch (error) {
    console.error("Erreur join salle vidéo :", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion à la salle vidéo" });
  }
}