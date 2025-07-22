import { Router } from "express"
import { getMedecins, createMedecin, deleteMedecin, getMedecinById, getMedecinsBySpecialite } from "../controllers/medecins.controller.js"
import { authenticate, adminOnly } from "../middlewares/auth.middleware.js"



const medecinsRouter = Router()

medecinsRouter.get('/', authenticate, adminOnly, getMedecins)

medecinsRouter.get('/:id' , authenticate, adminOnly, getMedecinById)

medecinsRouter.post('/' , authenticate, adminOnly, createMedecin)

medecinsRouter.delete('/:id' , authenticate, adminOnly, deleteMedecin)

medecinsRouter.get('/:specialite' , authenticate, adminOnly, getMedecinsBySpecialite)  

export default medecinsRouter