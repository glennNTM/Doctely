import { Router } from "express"
import { createRdv, getRdv, getRdvByStatut,getRdvByPatient, getRdvByMedecin, createRdvVideo, joinRdvVideo, cancelRdv } from "../controllers/rdv.controller.js"
import { medecinOnly, authenticate, adminOnly  } from "../middlewares/auth.middleware.js"

const rdvRouter = Router()

rdvRouter.post('/', authenticate, medecinOnly, createRdv)

rdvRouter.get('/', authenticate, adminOnly, getRdv)

rdvRouter.get('/?statut=XXX', authenticate, getRdvByStatut )

rdvRouter.get('/patient/me', authenticate, getRdvByPatient)

rdvRouter.get('/medecin/me', authenticate, medecinOnly, getRdvByMedecin)

rdvRouter.put('/:id/cancel', authenticate, medecinOnly, cancelRdv)

rdvRouter.post('/:id/video', authenticate, medecinOnly, createRdvVideo)

rdvRouter.get('/:id/video', authenticate, joinRdvVideo)



export default rdvRouter