import { Router } from "express"
import { logIn, logOut, register } from "../controllers/auth.controller.js"

const authRouter = Router()

authRouter.post('/login', logIn)

authRouter.post('/register', register)

authRouter.post('/logout', logOut)

authRouter.get('/me', (req, res) => res.send({ title: 'Route de récupération des informations utilisateur' }))

authRouter.put('/change-password', (req, res) => res.send({ title: 'Route de changement de mot de passe' }))

export default authRouter