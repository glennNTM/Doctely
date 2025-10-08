import { Router } from "express"
import { submitConsultation, getMedecinConsultations, acceptConsultation, deleteConsultation, getConsultations } from "../controllers/demandeConsultation.controller.js"
import { authenticate, medecinOnly, patientOnly } from "../middlewares/auth.middleware.js"


const demandeConsultationRouter = Router()

demandeConsultationRouter.post('/', authenticate , patientOnly, submitConsultation)

demandeConsultationRouter.get('/medecin/me', authenticate, medecinOnly, getMedecinConsultations)

demandeConsultationRouter.get('/patient/me', authenticate, patientOnly, getConsultations)

demandeConsultationRouter.put('/:id/accept', authenticate, medecinOnly, acceptConsultation )

demandeConsultationRouter.delete('/:id/delete', authenticate, medecinOnly, deleteConsultation )


export default demandeConsultationRouter