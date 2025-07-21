import { PrismaClient } from '../generated/prisma/index.js'


const prisma = new PrismaClient()

/**
 * @route   GET /api/patients
 * @desc    Récupère tous les patients depuis la base de données
 * @access  Admin uniquement
 */
export const getPatients = async (req, res) => {
    try {
        // 🔍 Requête à la base de données pour récupérer tous les patients
        const patients = await prisma.patient.findMany();

        // ✅ Si des patients sont trouvés, les retourner avec un code HTTP 200
        return res.status(200).json({
            success: true,
            count: patients.length,
            data: patients,
        })

    } catch (error) {
        // ❌ En cas d'erreur, afficher dans la console pour le debug
        console.error('Erreur GET /api/patients :', error);

        // 🛑 Renvoyer une réponse d'erreur au client
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de récupérer les patients.",
        })
    }
}

/**
 * @route   GET /api/patients/:id
 * @param   {string} id - ID du patient à récupérer
 * @desc    Récupère un patient spécifique par son ID
 * @access  Admin et médecin uniquement
 */
export const getPatientById = async (req, res) => {
    try {
        // ✅ Récupération de l'ID depuis les paramètres d'URL et conversion en entier
        const patientId = parseInt(req.params.id, 10);

        // 🔍 Vérification de la présence de l'ID
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "ID du patient manquant.",
            })
        }

        // 🔍 Recherche du patient dans la base de données via Prisma
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        })

        // ❌ Si le patient n'est pas trouvé
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient non trouvé.",
            })
        }

        // ✅ Patient trouvé, on le retourne
        return res.status(200).json({
            success: true,
            data: patient,
        })

    } catch (error) {
        console.error("Erreur GET /api/patients/:id :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de récupérer le patient.",
        })
    }
}

/**
 * @route   PUT /api/patients/:id
 * @param   {string} id - ID du patient à récupérer
 * @desc    Met à jour un patient spécifique par son ID
* @access  Patient uniquement
 */
export const updatePatient = async (req, res) => {
    try {
        // ✅ Récupération de l'ID depuis les paramètres d'URL et conversion en entier
        const patientId = parseInt(req.params.id, 10)

        // 🔍 Vérification de la présence de l'ID
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "ID du patient manquant.",
            })
        }

        // 🔍 Recherche du patient dans la base de données via Prisma
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        })

        // ❌ Si le patient n'est pas trouvé
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient non trouvé.",
            })
        }
        // 🔄 Mise à jour des données du patient avec les nouvelles informations
        const updatedPatient = await prisma.patient.update({
            where: { id: patientId },
            data: req.body, // Les données à mettre à jour sont passées dans le corps de la requête
        })

        // ✅ Patient mis à jour, on le retourne
        return res.status(200).json({
            success: true,
            data: updatedPatient,
        })
    } catch (error) {
        console.error("Erreur PUT /api/patients/:id :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de mettre à jour le patient.",
        })
    }
}

/**
 * @route   DELETE /api/patients/:id
 * @param   {string} id - ID du patient à récupérer
 * @desc    Supprime un patient spécifique par son ID
* @access  Admin uniquement
 */
export const deletePatient = async (req, res) => {
    try {
        // ✅ Récupération de l'ID depuis les paramètres d'URL et conversion en entier
        const patientId = parseInt(req.params.id, 10)

        // 🔍 Vérification de la présence de l'ID
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "ID du patient manquant.",
            })
        }

        // 🔍 Recherche du patient dans la base de données via Prisma
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        })

        // ❌ Si le patient n'est pas trouvé
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient non trouvé.",
            })
        }
        // 🗑️ Suppression du patient de la base de données
        await prisma.patient.delete({
            where: { id: patientId },
        })

        // ✅ Patient supprimé, on retourne une réponse
        return res.status(200).json({
            success: true,
            message: "Patient supprimé avec succès.",
        })
    } catch (error) {
        console.error("Erreur DELETE /api/patients/:id :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur. Impossible de supprimer le patient.",
        })

    }
}