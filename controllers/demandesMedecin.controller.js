import { PrismaClient } from '../generated/prisma/index.js'


const prisma = new PrismaClient()

/**
 * @route   GET /api/demande-medecin
 * @desc    Recupere toutes les demandes d'inscription des medecins
 * @access  Admin uniquement
 */
export const getdemandesMedecin = async (req, res) => {
    try {
        const demandeMedecin = await prisma.demandeMedecin.findMany()
        return res.status(200).json({
            success: true,
            count: demandeMedecin.length,
            data: demandeMedecin,
        })
    } catch (error) {
        console.error('Erreur GET /api/demande-medecin :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de récupérer les demandes de medecin.",
        })
    }
}

/**
 * @route   GET /api/demande-medecin/:id
 * @desc    Recupere une demande d'inscription de medecin specifique avec son ID
 * @access  Admin uniquement
 */
export const getdemandesMedecinById = async (req, res) => {
    try {
        // On recuepere l'ID et on convertit en entier
        const demandeMedecinId = parseInt(req.params.id, 10)

        // On verifie si il y a l'ID dans la requete
        if (!demandeMedecinId) {
            return res.status(400).json({
                success: false,
                message: "ID de la demande de medecin manquant.",
            })
        }

        // On recherche la demande dans la base de donnees
        const demandeMedecin = await prisma.demandeMedecin.findUnique({
            where: { id: demandeMedecinId },
        })
        if (!demandeMedecin) {
            return res.status(404).json({
                success: false,
                message: "Demande de medecin non trouvée.",
            })
        }
        // On retourne la demande recuperee
        return res.status(200).json({
            success: true,
            data: demandeMedecin,
        })
    } catch (error) {
        console.error('Erreur GET /api/demande-medecin/:id :', error);
        return res.status(500).json({
            success: false,
            meassage: "Erreur interne du serveur. Impossible de récupérer la demande de medecin.",
        })
    }
}

/**
 * @route   POST /api/demande-medecin
 * @desc    Créer une nouvelle demande d'inscription de médecin
 * @access  Public
 */
export const createdemandeMedecin = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      specialite,
      certificat, // Base64 envoyé par le front
      motivation,
    } = req.body;

    // Vérifications des champs obligatoires
    if (
      !nom ||
      !prenom ||
      !email ||
      !telephone ||
      !adresse ||
      !specialite ||
      !certificat ||
      !motivation
    ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires",
      });
    }

    if (motivation.length < 100) {
      return res.status(400).json({
        success: false,
        message: "La lettre de motivation doit contenir au moins 100 caractères",
      });
    }

    // Vérification que le fichier est bien un PDF encodé en base64
    if (!certificat.startsWith("data:application/pdf;base64,")) {
      return res.status(400).json({
        success: false,
        message: "Le certificat doit être un fichier PDF encodé en base64",
      });
    }

    // Enregistrement dans la base (PostgreSQL, Prisma)
    const nouvelleDemande = await prisma.demandeMedecin.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        adresse,
        specialite,
        certificat, // Base64 stocké en base (champ TEXT ou LONGTEXT recommandé)
        motivation,
        statut: "EN_ATTENTE", // valeur par défaut
      },
    })

    return res.status(201).json({
      success: true,
      message: "Votre demande a été enregistrée avec succès.",
      data: nouvelleDemande,
    });
  } catch (error) {
    console.error("Erreur POST /api/demande-medecin :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur. Impossible de créer la demande.",
      error: error.message,
    })
  }
}


/**
 * @route   PUT /api/demande-medecin/:id
 * @desc    Accepter ou refuser une demande d'inscription 
 * @access  Admin-only
 */
export const updatedemandeMedecin = async (req, res) => {
    try {
        const demandeId = parseInt(req.params.id, 10)
        const { statut } = req.body // 'ACCEPTE' ou 'REFUSE'

        if (!demandeId || !['ACCEPTE', 'REFUSE'].includes(statut)) {
            return res.status(400).json({
                success: false,
                message: "ID invalide ou statut incorrect. Utilisez 'accepte' ou 'refuse'."
            })
        }

        // Vérifie si la demande existe
        const demandeExistante = await prisma.demandeMedecin.findUnique({
            where: { id: demandeId }
        })

        if (!demandeExistante) {
            return res.status(404).json({
                success: false,
                message: "Demande de médecin non trouvée."
            })
        }

        // Met à jour le statut de la demande
        const updatedDemande = await prisma.demandeMedecin.update({
            where: { id: demandeId },
            data: { statut }
        })

        return res.status(200).json({
            success: true,
            message: `Demande mise à jour avec le statut '${statut}'.`,
            data: updatedDemande
        })
    } catch (error) {
        console.error("Erreur PUT /api/demande-medecin/:id :", error)
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de mettre à jour la demande."
        })
    }
}

/**
 * @route   DELETE /api/demande-medecin/:id
 * @desc    Supprime une demande de médecin par son ID
 * @access  Admin uniquement
 */
export const deleteDemandeMedecin = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        // Vérifie si l'ID est un nombre valide
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID invalide ou manquant.",
            })
        }

        // Recherche de la demande à supprimer
        const demande = await prisma.demandeMedecin.findUnique({
            where: { id },
        })

        if (!demande) {
            return res.status(404).json({
                success: false,
                message: "Demande de médecin introuvable.",
            })
        }

        // Suppression de la demande
        await prisma.demandeMedecin.delete({
            where: { id },
        })

        return res.status(200).json({
            success: true,
            message: "Demande de médecin supprimée avec succès.",
        })
    } catch (error) {
        console.error("Erreur DELETE /api/demande-medecin/:id :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur. Impossible de supprimer la demande de médecin.",
        })
    }
}

/**
 * @route   GET /api/medecin-demande?statut=XXX
 * @desc    Récupérer les demandes de médecins filtrées par statut
 * @access  Admin-only
 */
export const getDemandesMedecinsParStatut = async (req, res) => {
  try {
    const { statut } = req.query

    if (!statut) {
      return res.status(400).json({
        success: false,
        message: "Le paramètre 'statut' est requis."
      })
    }

    const demandes = await prisma.demandeMedecin.findMany({
      where: { statut }
    })

    return res.status(200).json({
      success: true,
      total: demandes.length,
      data: demandes
    })
  } catch (error) {
    console.error('Erreur GET /api/medecin-demande :', error)
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur"
    })
  }
}
