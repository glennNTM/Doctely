/**
 * @swagger
 * tags:
 *   name: Médecins
 *   description: Gestion des médecins
 */

/**
 * @swagger
 * /api/medecins:
 *   get:
 *     summary: Récupérer tous les médecins
 *     tags: [Médecins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des médecins récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/medecins/{id}:
 *   get:
 *     summary: Récupérer un médecin spécifique par ID
 *     tags: [Médecins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du médecin à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du médecin
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Médecin non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/medecins:
 *   post:
 *     summary: Créer un nouveau médecin
 *     tags: [Médecins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - motDePasse
 *               - specialite
 *               - certificat
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               specialite:
 *                 type: string
 *               certificat:
 *                 type: string
 *               adresse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Médecin créé avec succès
 *       400:
 *         description: Champs obligatoires manquants ou spécialité invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/medecins/{id}:
 *   delete:
 *     summary: Supprimer un médecin par ID
 *     tags: [Médecins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du médecin à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médecin supprimé avec succès
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Médecin non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/medecins:
 *   get:
 *     summary: Récupérer les médecins par spécialité (via query param)
 *     tags: [Médecins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialite
 *         required: false
 *         schema:
 *           type: string
 *         description: Nom de la spécialité à filtrer
 *     responses:
 *       200:
 *         description: Liste des médecins filtrée par spécialité
 *       500:
 *         description: Erreur serveur
 */
