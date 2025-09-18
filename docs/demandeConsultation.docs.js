/**
 * @swagger
 * tags:
 *   name: Demandes de consultation
 *   description: Routes liées aux demandes de consultation entre patients et médecins
 */

/**
 * @swagger
 * /api/demande-consultation:
 *   post:
 *     summary: Soumettre une demande de consultation
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialite
 *               - motif
 *             properties:
 *               specialite:
 *                 type: string
 *                 enum: [GENERALISTE, CARDIOLOGUE, DERMATOLOGUE, GYNECOLOGUE, PSYCHOLOGUE, NEUROLOGUE, OPHTALMOLOGUE, PEDIATRE, DENTISTE]
 *                 example: CARDIOLOGUE
 *               motif:
 *                 type: string
 *                 example: Douleurs thoraciques récurrentes
 *     responses:
 *       201:
 *         description: Demande soumise avec succès, médecins de la spécialité notifiés
 *       400:
 *         description: Champs requis manquants ou spécialité invalide
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/demande-consultation/medecin/me:
 *   get:
 *     summary: Récupérer les demandes de consultation liées à la spécialité du médecin connecté
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes filtrées par spécialité
 *       403:
 *         description: Accès interdit, réservé aux médecins
 *       404:
 *         description: Médecin non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-consultation/patient/me:
 *   get:
 *     summary: Récupérer les demandes de consultation du patient connecté
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes du patient
 *       403:
 *         description: Accès interdit, réservé aux patients
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-consultation/{id}/accept:
 *   put:
 *     summary: Accepter une demande de consultation
 *     description: Le médecin accepte une demande de consultation. Le patient recevra une notification en temps réel.
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande à accepter
 *     responses:
 *       200:
 *         description: Demande acceptée avec succès, patient notifié
 *       403:
 *         description: Accès interdit ou spécialité incompatible
 *       404:
 *         description: Médecin ou demande non trouvée
 *       400:
 *         description: Demande déjà traitée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-consultation/{id}/reject:
 *   put:
 *     summary: Refuser une demande de consultation
 *     description: Le médecin refuse une demande de consultation.
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande à refuser
 *     responses:
 *       200:
 *         description: Demande refusée
 *       403:
 *         description: Accès interdit ou spécialité incompatible
 *       404:
 *         description: Médecin ou demande non trouvée
 *       400:
 *         description: Demande déjà traitée
 *       500:
 *         description: Erreur serveur
 */
