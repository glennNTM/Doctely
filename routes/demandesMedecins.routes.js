import { Router } from "express"
import { getdemandesMedecin, createdemandeMedecin, getdemandesMedecinById, updatedemandeMedecin, deleteDemandeMedecin, getDemandesMedecinsParStatut } from "../controllers/demandesMedecin.controller.js"
import { adminOnly, authenticate } from "../middlewares/auth.middleware.js"

const demandeMedecinRouter = Router()

demandeMedecinRouter.post('/', createdemandeMedecin)

demandeMedecinRouter.get('/', authenticate, adminOnly, getdemandesMedecin)

demandeMedecinRouter.get('/:id', authenticate, adminOnly, getdemandesMedecinById)

demandeMedecinRouter.get('/statut', authenticate, adminOnly, getDemandesMedecinsParStatut)

demandeMedecinRouter.put('/:id', authenticate, adminOnly, updatedemandeMedecin)

demandeMedecinRouter.delete('/:id', authenticate, adminOnly, deleteDemandeMedecin)

export default demandeMedecinRouter