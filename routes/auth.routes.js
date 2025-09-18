import { Router } from "express"
import { logIn, logOut, register, getMe, updateMe } from "../controllers/auth.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post('/login', logIn)

authRouter.post('/register', register)

authRouter.post('/logout', authenticate , logOut)

authRouter.get('/me', authenticate , getMe)

authRouter.put('/me', authenticate , updateMe)


export default authRouter