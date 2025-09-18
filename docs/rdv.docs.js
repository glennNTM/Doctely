/**
 * @swagger
 * tags:
 *   name: RendezVous
 *   description: Gestion des rendez-vous
 */

/**
 * @swagger
 * /api/rendez-vous:
 *   post:
 *     summary: Créer un rendez-vous
 *     description: Créer un nouveau rendez-vous. Les notifications automatiques seront envoyées 5 minutes avant l'heure du RDV.
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Informations du rendez-vous à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, date, heure, motif]
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-25"
 *               heure:
 *                 type: string
 *                 pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
 *                 example: "14:30"
 *               motif:
 *                 type: string
 *                 example: "Consultation de suivi"
 *               type:
 *                 type: string
 *                 enum: [EN_PERSONNE, TELECONSULTATION]
 *                 example: "EN_PERSONNE"
 *               demandeId:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès, notifications programmées
 *       400:
 *         description: Données manquantes ou invalides
 *       403:
 *         description: Accès interdit, réservé aux médecins
 *       404:
 *         description: Médecin non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous:
 *   get:
 *     summary: Récupérer tous les rendez-vous (admin uniquement)
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous:
 *   get:
 *     summary: Récupérer les rendez-vous selon un statut
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PLANIFIE, REALISE, ANNULE]
 *         description: Statut du rendez-vous
 *     responses:
 *       200:
 *         description: Liste des rendez-vous filtrés
 *       400:
 *         description: Statut manquant ou invalide
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous/patient/me:
 *   get:
 *     summary: Récupérer les rendez-vous du patient connecté
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous du patient
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous/medecin/me:
 *   get:
 *     summary: Récupérer les rendez-vous du médecin connecté
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous du médecin
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous/{id}/cancel:
 *   put:
 *     summary: Annuler un rendez-vous
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du rendez-vous à annuler
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rendez-vous annulé avec succès
 *       400:
 *         description: ID invalide
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Rendez-vous non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous/{id}/video:
 *   post:
 *     summary: Créer une salle de téléconsultation
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du rendez-vous
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salle vidéo créée avec succès
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/rendez-vous/{id}/video:
 *   get:
 *     summary: Rejoindre une salle de téléconsultation
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du rendez-vous
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lien ou données de la salle vidéo
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */
