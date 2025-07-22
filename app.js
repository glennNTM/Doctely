import express from 'express'
import cookieParser from 'cookie-parser'
import { PORT } from './config/env.js'
import medecinsRouter from './routes/medecins.routes.js'
import authRouter from './routes/auth.routes.js'
import adminRouter from './routes/admin.routes.js'
import patientsRouter from './routes/patients.routes.js'
import demandeConsultationRouter from './routes/demandes.routes.js'
import notificationsRouter from './routes/notifications.routes.js'
import ordannancesRouter from './routes/ordonnances.routes.js'
import rdvRouter from './routes/rendezvous.routes.js'
import  demandeMedecinRouter  from './routes/demandesMedecins.routes.js'

const app = express()



// Middleware pour gerer le format des donnees
app.use(express.json())

// Middleware pour parser les cookies (requis pour express-session)
app.use(cookieParser())

// Routes
app.use('/api/medecins', medecinsRouter)
app.use('/api/auth', authRouter)
app.use('/api/admins', adminRouter)
app.use('/api/demande-medecin', demandeMedecinRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/demande-consultation', demandeConsultationRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/ordonnances', ordannancesRouter)
app.use('/api/rendez-vous', rdvRouter)

app.get('/', (req, res) =>{res.send("Bienvenue sur l'API de Doctely")})

app.listen(PORT, () => {
  console.log(`Le server tourne sur http://localhost:${PORT}`)})



export default app