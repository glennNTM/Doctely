/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l’authentification et des profils utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d’un patient
 *     tags: [Auth]
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
 *                 example: Jean
 *               prenom:
 *                 type: string
 *                 example: Dupont
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               motDePasse:
 *                 type: string
 *                 example: 1234567890
 *               telephone:
 *                 type: string
 *                 example: "+24106778899"
 *               adresse:
 *                 type: string
 *                 example: Libreville
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-12
 *               genre:
 *                 type: string
 *                 enum: [HOMME, FEMME]
 *                 example: HOMME
 *               groupeSanguin:
 *                 type: string
 *                 enum: [A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE, AB_POSITIVE, AB_NEGATIVE, O_POSITIVE, O_NEGATIVE]
 *               historiqueMedical:
 *                 type: string
 *                 example: Allergie aux antibiotiques
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Champs manquants
 *       409:
 *         description: Patient déjà existant
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               motDePasse:
 *                 type: string
 *                 example: 1234567890
 *               role:
 *                 type: string
 *                 enum: [PATIENT, MEDECIN, ADMIN]
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l’utilisateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer le profil de l’utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l’utilisateur connecté
 *       401:
 *         description: Non autorisé ou token manquant
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Modifier le profil de l’utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       401:
 *         description: Non autorisé ou token manquant
 *       404:
 *         description: Utilisateur non trouvé
 */
