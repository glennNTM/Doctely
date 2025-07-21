import { Router } from "express"
import { getPatients, getPatientById, updatePatient, deletePatient } from "../controllers/patients.controller.js"

const patientsRouter = Router()

patientsRouter.get('/', getPatients)

patientsRouter.get('/:id', getPatientById)

patientsRouter.put('/:id', updatePatient)

patientsRouter.delete('/:id', deletePatient)

export default patientsRouter