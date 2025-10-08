import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import medecinsRouter from './routes/medecins.routes.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import patientsRouter from './routes/patients.routes.js';
import demandeConsultationRouter from './routes/demandes.routes.js';
import notificationsRouter from './routes/notifications.routes.js';
import ordonnancesRouter from './routes/ordonnances.routes.js';
import rdvRouter from './routes/rendezvous.routes.js';
import demandeMedecinRouter from './routes/demandesMedecins.routes.js';
import http from 'http';
import { initSocket } from './config/socket.js';
import { initScheduler } from './utils/scheduler.js';
import cors from 'cors';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import { setupSwagger } from './config/swagger.js';

const app = express();

setupSwagger(app);

// Middleware pour gérer les CORS
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://doctely.netlify.app',
      `http://localhost:${PORT}`, // Port dynamique pour Swagger UI
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
  })
);

// Middleware de sécurité Helmet (protection XSS de base et autres en-têtes de sécurité)
app.use(helmet());

// Protection contre les attaques XSS (nettoie les entrées utilisateur)
app.use(xssClean());

// Middleware pour logger les requêtes

// Création du serveur HTTP
const server = http.createServer(app);

// Step 1: Initialisation de Socket.IO pour les notifications temps réel
initSocket(server);

// Step 2: Initialisation du planificateur pour les RDV imminents
initScheduler();

// Middleware pour gerer le format des donnees
app.use(express.json());

// Middleware pour parser les cookies (requis pour express-session)
app.use(cookieParser());

// Routes
app.use('/api/medecins', medecinsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admins', adminRouter);
app.use('/api/demande-medecin', demandeMedecinRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/demande-consultation', demandeConsultationRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/ordonnances', ordonnancesRouter);
app.use('/api/rendez-vous', rdvRouter);

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de Doctely');
});

server.listen(PORT, () => {
  console.log(`Le serveur du backend est démarré sur http://localhost:${PORT}`);
});

export default app;
