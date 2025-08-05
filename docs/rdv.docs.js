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
 *               date:
 *                 type: string
 *                 format: date-time
 *               heure:
 *                 type: string
 *               motif:
 *                 type: string
 *               type:
 *                 type: string
 *               demandeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       403:
 *         description: Accès interdit
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
