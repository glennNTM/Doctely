/**
 * @swagger
 * tags:
 *   name: Ordonnances
 *   description: Gestion des ordonnances par les médecins et les patients
 */

/**
 * @swagger
 * /api/ordonnances:
 *   post:
 *     summary: Créer une ordonnance liée à un rendez-vous
 *     tags: [Ordonnances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *               - rendezVousId
 *             properties:
 *               contenu:
 *                 type: string
 *               format:
 *                 type: string
 *                 default: text
 *               rendezVousId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ordonnance créée avec succès
 *       400:
 *         description: Champs requis manquants ou invalides
 *       403:
 *         description: Accès interdit au rendez-vous
 *       409:
 *         description: Ordonnance déjà existante
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/ordonnances/me:
 *   get:
 *     summary: Récupérer toutes les ordonnances du patient connecté
 *     tags: [Ordonnances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ordonnances du patient
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/ordonnances/me/medecin:
 *   get:
 *     summary: Récupérer toutes les ordonnances créées par un médecin
 *     tags: [Ordonnances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ordonnances du médecin
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/ordonnances/{id}/download:
 *   get:
 *     summary: Télécharger une ordonnance en format PDF simulé
 *     tags: [Ordonnances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'ordonnance à télécharger
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fichier téléchargé avec succès
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accès interdit à cette ordonnance
 *       404:
 *         description: Ordonnance introuvable
 *       500:
 *         description: Erreur serveur
 */
