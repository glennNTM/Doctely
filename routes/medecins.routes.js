import { Router } from "express"
import { getMedecins, createMedecin, deleteMedecin, getMedecinById, getMedecinsBySpecialite } from "../controllers/medecins.controller.js"

const medecinsRouter = Router()

medecinsRouter.get('/', getMedecins)

medecinsRouter.get('/:id', getMedecinById)

medecinsRouter.post('/', createMedecin)

medecinsRouter.delete('/:id', deleteMedecin)

medecinsRouter.get('/:specialite', getMedecinsBySpecialite)  

export default medecinsRouter