import { Router } from "express";

const notificationsRouter = Router();

notificationsRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les notifications' })})

notificationsRouter.put('/:id/lu', (req, res) => {res.send({ title: 'Route pour marquer une notification comme lue' })})

export default notificationsRouter;