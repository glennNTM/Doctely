/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion des administrateurs
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Récupérer tous les administrateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nom:
 *                         type: string
 *                         example: Doe
 *                       prenom:
 *                         type: string
 *                         example: John
 *                       email:
 *                         type: string
 *                         example: admin@example.com
 *                       telephone:
 *                         type: string
 *                       adresse:
 *                         type: string
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Créer un nouvel administrateur
 *     tags: [Admin]
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
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Doe
 *               prenom:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               motDePasse:
 *                 type: string
 *                 example: 1234567890
 *               telephone:
 *                 type: string
 *                 example: "+24106667788"
 *               adresse:
 *                 type: string
 *                 example: Libreville
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *       400:
 *         description: Requête invalide ou admin déjà existant
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Supprimer un administrateur par son ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l’administrateur
 *     responses:
 *       200:
 *         description: Administrateur supprimé avec succès
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Administrateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
