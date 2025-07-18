import { Router } from "express";

const rdvRouter = Router();

rdvRouter.post('/', (req, res) => {res.send({ title: 'Route pour créer un rendez-vous'})})

rdvRouter.get('/', (req, res) => {res.send({ title: 'Route pour récupérer les rendez-vous'})})

rdvRouter.get('/:id', (req, res) => {res.send({ title: 'Route pour récupérer un rendez-vous par son ID'})})

rdvRouter.put('/:id', (req, res) => {res.send({ title: 'Route pour mettre à jour un rendez-vous'})})

rdvRouter.delete('/:id', (req, res) => {res.send({ title:'Route pour supprimer un rendez-vous'})})

export default rdvRouter