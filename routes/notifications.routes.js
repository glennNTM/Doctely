import { Router } from "express"
import { getNotifications, putNotificationToRead, deleteNotification } from "../controllers/notifications.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"

const notificationsRouter = Router()

// Route pour récupérer les notifications de l'utilisateur connecté
notificationsRouter.get("/me", authenticate, getNotifications)

// Route pour marquer une notification comme lue
notificationsRouter.put("/:id/lu", authenticate, putNotificationToRead)

// Route pour supprimer une notification
notificationsRouter.delete("/:id", authenticate, deleteNotification)

export default notificationsRouter
