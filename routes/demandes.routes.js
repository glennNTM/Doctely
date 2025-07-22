import { Router } from "express"
import { submitConsultation, getConsultations, acceptConsultation, rejectConsultation } from "../controllers/demandeConsultation.controller.js"
import { authenticate, medecinOnly, patientOnly } from "../middlewares/auth.middleware.js"


const demandeConsultationRouter = Router()

demandeConsultationRouter.post('/', authenticate , patientOnly, submitConsultation)

demandeConsultationRouter.get('/me', authenticate, medecinOnly, getConsultations)

demandeConsultationRouter.put('/:id/accept', authenticate, medecinOnly, acceptConsultation )

demandeConsultationRouter.put('/:id/reject', authenticate, medecinOnly, rejectConsultation )


export default demandeConsultationRouter