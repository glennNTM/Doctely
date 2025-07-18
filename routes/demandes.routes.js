import { Router } from "express"

const demandeConsultationRouter = Router()

demandeConsultationRouter.post('/', (req, res) => {res.send({ title: 'Route pour créer une demande de consultation'})})

demandeConsultationRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les demandes de consultation'})})

demandeConsultationRouter.get('/:id', (req, res) => {res.send({ title: 'Route pour récupérer une demande de consultation par son ID'})})

export default demandeConsultationRouter