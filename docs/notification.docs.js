/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestion des notifications pour tous les utilisateurs
 */

/**
 * @swagger
 * /api/notifications/me:
 *   get:
 *     summary: Récupérer les notifications de l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications récupérées avec succès
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
