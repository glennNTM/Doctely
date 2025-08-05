/**
 * @swagger
 * tags:
 *   name: Demandes de consultation
 *   description: Routes liées aux demandes de consultation entre patients et médecins
 */

/**
 * @swagger
 * /api/demande-medecin:
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
 *                 example: GENERALISTE
 *               motif:
 *                 type: string
 *                 example: Consultation pour maux de tête
 *     responses:
 *       201:
 *         description: Demande soumise avec succès
 *       400:
 *         description: Champs requis manquants ou spécialité invalide
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/demande-consultation/me:
 *   get:
 *     summary: Récupérer les demandes de consultation liées à la spécialité du médecin connecté
 *     tags: [Demandes de consultation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes filtrées
 *       403:
 *         description: Accès interdit, réservé aux médecins
 *       404:
 *         description: Médecin non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-medecin/{id}/accept:
 *   put:
 *     summary: Accepter une demande de consultation
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
 *         description: Demande acceptée
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
 * /api/demande-medecin/{id}/reject:
 *   post:
 *     summary: Refuser une demande de consultation
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
