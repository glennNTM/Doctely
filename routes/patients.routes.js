import { Router } from "express"

const patientsRouter = Router()

patientsRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les patients'})})

patientsRouter.get('/:id', (req, res) => {res.send({ title: 'Route pour récupérer un patient par son ID'})})

patientsRouter.post('/', (req, res) => {res.send({ title: 'Route pour créer un patient'})})

patientsRouter.put('/:id', (req, res) => {res.send({ title: 'Route pour mettre à jour un patient'})})

patientsRouter.delete('/:id', (req, res) => {res.send({ title: 'Route pour supprimer un patient'})})

export default patientsRouter