import { Router } from "express"
import { getPatients, getPatientById, updatePatient, deletePatient } from "../controllers/patients.controller.js"
import { authenticate, adminOnly } from "../middlewares/auth.middleware.js"

const patientsRouter = Router()

patientsRouter.get("/", authenticate, adminOnly, getPatients)

patientsRouter.get("/:id", authenticate, adminOnly, getPatientById)

patientsRouter.put("/:id", updatePatient)

patientsRouter.delete("/:id", authenticate, adminOnly, deletePatient)

export default patientsRouter
