import { Router } from "express"
import { getdemandesMedecin, createdemandeMedecin, getdemandesMedecinById, updatedemandeMedecin, deleteDemandeMedecin, getDemandesMedecinsParStatut } from "../controllers/demandesMedecin.controller.js"

const demandeMedecinRouter = Router()

demandeMedecinRouter.post('/', createdemandeMedecin)

demandeMedecinRouter.get('/', getdemandesMedecin)

demandeMedecinRouter.get('/:id',getdemandesMedecinById)

demandeMedecinRouter.get('/statut', getDemandesMedecinsParStatut)

demandeMedecinRouter.put('/:id', updatedemandeMedecin)

demandeMedecinRouter.delete('/:id', deleteDemandeMedecin)

export default demandeMedecinRouter