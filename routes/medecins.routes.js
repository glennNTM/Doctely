import { Router } from "express"

const medecinsRouter = Router()

medecinsRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les medecins'})})

medecinsRouter.get('/:id', (req, res) => {res.send({ title: 'Route pour récupérer un medecin par son ID'})})

medecinsRouter.post('/', (req, res) => {res.send({ title: 'Route pour créer un medecin'})})

medecinsRouter.get('/?specialite=:specialite', (req, res) => {const { specialite } = req.query; res.send({ title: `Route pour récupérer les medecins par spécialité: ${specialite}` })})

medecinsRouter.put('/:id', (req, res) => {res.send({ title: 'Route pour mettre à jour un medecin'})})

medecinsRouter.delete('/:id', (req, res) => {res.send({ title: 'Route pour supprimer un medecin'})})

export default medecinsRouter