/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestion des notifications temps réel pour tous les utilisateurs. Les notifications sont envoyées via Socket.IO et sauvegardées en base de données.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la notification
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date de création de la notification
 *         type:
 *           type: string
 *           enum: [NOUVELLE_DEMANDE, DEMANDE_ACCEPTEE, RDV_IMMINENT]
 *           description: Type de notification
 *         contenu:
 *           type: string
 *           description: Contenu textuel de la notification
 *         lue:
 *           type: boolean
 *           description: Statut de lecture de la notification
 *         destinataireId:
 *           type: integer
 *           description: ID du destinataire
 *         typeDestinataire:
 *           type: string
 *           enum: [PATIENT, MEDECIN, ADMIN]
 *           description: Type du destinataire
 */

/**
 * @swagger
 * /api/notifications/me:
 *   get:
 *     summary: Récupérer les notifications de l'utilisateur connecté
 *     description: |
 *       Récupère toutes les notifications de l'utilisateur connecté, triées par date décroissante.
 *
 *       **Système de notifications temps réel :**
 *       - Les notifications sont envoyées via Socket.IO
 *       - Connexion Socket.IO : `socket.emit('register', userId)`
 *       - Écouter : `socket.on('nouvelle_notification', callback)`
 *
 *       **Types de notifications :**
 *       - `NOUVELLE_DEMANDE` : Pour les médecins quand un patient fait une demande
 *       - `DEMANDE_ACCEPTEE` : Pour les patients quand un médecin accepte
 *       - `RDV_IMMINENT` : Pour patient et médecin 5 minutes avant le RDV
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Type d'utilisateur non reconnu
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/notifications/{id}/lu:
 *   put:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la notification à marquer comme lue
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *       400:
 *         description: ID invalide ou type d'utilisateur non reconnu
 *       404:
 *         description: Notification non trouvée ou accès refusé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Supprimer une notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la notification à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification supprimée avec succès
 *       400:
 *         description: ID invalide ou type d'utilisateur non reconnu
 *       404:
 *         description: Notification non trouvée ou accès refusé
 *       500:
 *         description: Erreur serveur
 */
