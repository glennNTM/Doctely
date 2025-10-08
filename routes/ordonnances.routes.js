import { Router } from 'express';
import {
  createOrdonnance,
  downloadOrdonnance,
  getMedecinOrdonnance,
  getPatientOrdonnance,
} from '../controllers/ordonnances.controller.js';
import { medecinOnly, authenticate, patientOnly } from '../middlewares/auth.middleware.js';

const ordonnancesRouter = Router();

ordonnancesRouter.get('/me/medecin', authenticate, medecinOnly, getMedecinOrdonnance);

ordonnancesRouter.post('/', authenticate, medecinOnly, createOrdonnance);

ordonnancesRouter.get('/me', authenticate, patientOnly, getPatientOrdonnance);

ordonnancesRouter.get('/:id/download', authenticate, patientOnly, downloadOrdonnance);

export default ordonnancesRouter;
