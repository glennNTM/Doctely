/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Gestion des patients (admin, médecin, patient)
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Récupérer tous les patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des patients récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Récupérer un patient spécifique par son ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du patient
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient trouvé avec succès
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Patient non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Mettre à jour les informations d’un patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du patient à mettre à jour
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Données à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Patient mis à jour avec succès
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Patient non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Supprimer un patient spécifique
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du patient à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient supprimé avec succès
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Patient non trouvé
 *       500:
 *         description: Erreur serveur
 */
