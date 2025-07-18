import { Router } from "express"

const authRouter = Router()

authRouter.post('/login', (req, res) => res.send({ title: 'Route de connexion' }))

authRouter.post('/register', (req, res) => res.send({ title: 'Route d\'inscription' }))

authRouter.get('/logout', (req, res) => res.send({ title: 'Route de déconnexion' }))

authRouter.get('/me', (req, res) => res.send({ title: 'Route de récupération des informations utilisateur' }))

authRouter.put('/change-password', (req, res) => res.send({ title: 'Route de changement de mot de passe' }))

export default authRouter