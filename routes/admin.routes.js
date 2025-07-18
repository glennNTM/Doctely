import { Router } from "express";

const adminRouter = Router();

adminRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les administrateurs'})})

adminRouter.post('/', (req, res) => {res.send({ title: 'Route pour créer un administrateur'})})


export default adminRouter