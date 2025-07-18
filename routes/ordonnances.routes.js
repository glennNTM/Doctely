import { Router } from "express";

const ordannancesRouter = Router()

ordannancesRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les ordonnances' })})

ordannancesRouter.get('/:id', (req, res) => {res.send({ title: 'Route pour récupérer une ordonnance par son ID' })})

ordannancesRouter.get('/me/:id', (req, res) => {res.send({ title: 'Route pour récupérer les ordonnances d’un patient par son ID' })})

export default ordannancesRouter