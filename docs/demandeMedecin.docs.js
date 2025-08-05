/**
 * @swagger
 * tags:
 *   name: Demandes Médecin
 *   description: Gestion des demandes d'inscription des médecins
 */

/**
 * @swagger
 * /api/demande-medecin:
 *   get:
 *     summary: Récupérer toutes les demandes d'inscription de médecins
 *     tags: [Demandes Médecin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-medecin/{id}:
 *   get:
 *     summary: Récupérer une demande de médecin par ID
 *     tags: [Demandes Médecin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande à récupérer
 *     responses:
 *       200:
 *         description: Détail de la demande
 *       400:
 *         description: ID manquant ou invalide
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-medecin:
 *   post:
 *     summary: Soumettre une nouvelle demande d'inscription en tant que médecin
 *     tags: [Demandes Médecin]
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
 *               - specialite
 *               - certificat
 *               - dateDemande
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               specialite:
 *                 type: string
 *               certificat:
 *                 type: string
 *               adresse:
 *                 type: string
 *               motivation:
 *                 type: string
 *               dateDemande:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       400:
 *         description: Données invalides ou incomplètes
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-medecin/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'une demande (ACCEPTE ou REFUSE)
 *     tags: [Demandes Médecin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la demande à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Statut à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [ACCEPTE, REFUSE]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/demande-medecin/{id}:
 *   delete:
 *     summary: Supprimer une demande de médecin par ID
 *     tags: [Demandes Médecin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande à supprimer
 *     responses:
 *       200:
 *         description: Demande supprimée avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/medecin-demande:
 *   get:
 *     summary: Filtrer les demandes de médecins par statut
 *     tags: [Demandes Médecin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           example: EN_ATTENTE
 *         required: true
 *         description: Statut à filtrer (e.g., EN_ATTENTE, ACCEPTE, REFUSE)
 *     responses:
 *       200:
 *         description: Liste filtrée des demandes
 *       400:
 *         description: Paramètre de filtrage manquant
 *       500:
 *         description: Erreur serveur
 */
