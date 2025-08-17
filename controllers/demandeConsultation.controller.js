import { PrismaClient, Specialite } from '../generated/prisma/index.js'

const prisma = new PrismaClient()


/**
 * @route   POST /api/demande-consultation
 * @desc    Soumettre une demande de consultation
 * @access  Patient uniquement
 */
export const submitConsultation = async (req, res) => { 
    try {
        // Récupération des données du corps de la requête
        const { specialite, motif } = req.body

        // On verifie si tous les champs requis sont remplis
        if (!specialite || !motif) {
            return res.status(400).json({
                success: false,
                message: "Les champs spécialité et motif sont obligatoires."
            })
        }
        // On verifie si la specialiete est valide
        const specialitesEnum = Object.values(Specialite)
    if (!specialitesEnum.includes(specialite)) {
        return res.status(400).json({ message: "Spécialité invalide." });
    }
    // On enregiste la demade de consultation dans la base de donnees
    const newConsultation = await prisma.demandeConsultation.create({
        data: {
            patientId: req.user.id,
            specialite,
            motif,
            statut: 'EN_ATTENTE'
        }
    })
    return res.status(201).json({
        success: true,
        data: newConsultation
    })
        
    } catch (error) {
        console.error("Erreur POST /api/demande-consultation :", error)
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de soumettre la demande de consultation." })
    }
 }

/**
 * @route   GET /api/demande-consultation/me
 * @desc   Récupérer toutes les demandes de consultation correspondant à la spécialité du médecin connecté
 * @access  Medecin uniquement
 * @filter  Seules les demandes avec statut: 'EN_ATTENTE' et correspondant à la spécialité du médecin
 */
export const getConsultations = async (req, res) => {
  try {
    const user = req.user

    // Vérifie que l'utilisateur est bien un médecin
    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({ error: "Accès interdit. Seuls les médecins peuvent accéder à cette ressource." });
    }

    // Récupère les infos du médecin (spécialité)
    const medecin = await prisma.medecin.findUnique({
      where: { id: user.id },
    });

    if (!medecin) {
      return res.status(404).json({ error: "Médecin non trouvé." });
    }

    // Récupère les demandes de consultation avec statut EN_ATTENTE et même spécialité que le médecin
    const consultations = await prisma.demandeConsultation.findMany({
      where: {
        statut: 'EN_ATTENTE',
        specialite: medecin.specialite,
      },
      include: {
        patient: true,
      },
    })

    return res.status(200).json(consultations);
  } catch (error) {
    console.error("Erreur lors de la récupération des consultations :", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération des consultations." });
  }
};

/**
 * @route   PUT /api/demande-medecin/:id/accept
 * @desc    Accepter une demande de consultation
 * @access  Medecin uniquement
 */
export const acceptConsultation = async (req, res) => {
  try {
    const user = req.user
    const demandeId = parseInt(req.params.id, 10);

    // Vérifie si l'utilisateur est un médecin
    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({ error: "Accès interdit. Seuls les médecins peuvent effectuer cette action." });
    }

    // Récupère le médecin connecté
    const medecin = await prisma.medecin.findUnique({ where: { id: user.id } });
    if (!medecin) {
      return res.status(404).json({ error: "Médecin non trouvé." });
    }

    // Récupère la demande
    const demande = await prisma.demandeConsultation.findUnique({ where: { id: demandeId } });
    if (!demande) {
      return res.status(404).json({ error: "Demande non trouvée." });
    }

    // Vérifie que la spécialité correspond
    if (demande.specialite !== medecin.specialite) {
      return res.status(403).json({ error: "Vous ne pouvez accepter que les demandes correspondant à votre spécialité." });
    }

    // Vérifie que la demande est en attente
    if (demande.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: "Cette demande a déjà été traitée." });
    }

    // Mise à jour de la demande
    const updatedDemande = await prisma.demandeConsultation.update({
      where: { id: demandeId },
      data: {
        statut: 'ACCEPTE',
        medecinId: medecin.id, 
      },
    })

    return res.status(200).json(updatedDemande);
  } catch (error) {
    console.error("Erreur lors de l'acceptation :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

/**
 * @route   POST /api/demande-medecin/:id/reject
 * @desc    Refuser une demande de consultation
 * @access  Medecin uniquement
 */
export const rejectConsultation = async (req, res) => {
  try {
    const user = req.user;
    const demandeId = parseInt(req.params.id, 10)

    if (!user || user.role !== 'MEDECIN') {
      return res.status(403).json({ error: "Accès interdit. Seuls les médecins peuvent effectuer cette action." });
    }

    const medecin = await prisma.medecin.findUnique({ where: { id: user.id } });
    if (!medecin) {
      return res.status(404).json({ error: "Médecin non trouvé." });
    }

    const demande = await prisma.demandeConsultation.findUnique({ where: { id: demandeId } });
    if (!demande) {
      return res.status(404).json({ error: "Demande non trouvée." });
    }

    if (demande.specialite !== medecin.specialite) {
      return res.status(403).json({ error: "Vous ne pouvez refuser que les demandes correspondant à votre spécialité." });
    }

    if (demande.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: "Cette demande a déjà été traitée." });
    }

    const updatedDemande = await prisma.demandeConsultation.update({
      where: { id: demandeId },
      data: {
        statut: 'REFUSE',
        medecinId: medecin.id, 
      },
    })

    return res.status(200).json(updatedDemande);
  } catch (error) {
    console.error("Erreur lors du refus :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
