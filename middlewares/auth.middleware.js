import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma/index.js'
import dotenv from 'dotenv';

dotenv.config() // Charge les variables d'environnement
const prisma = new PrismaClient()

export const authenticate = async (req, res, next) => {
    try {
        let token = req.cookies.token

        // Autoriser aussi les tokens dans l'en-tête Authorization (optionnel)
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ message: 'Accès non autorisé : token manquant.' })
        }

        // eslint-disable-next-line no-undef
        const JWT_SECRET = process.env.JWT_SECRET
        if (!JWT_SECRET) {
            console.error('❌ JWT_SECRET non défini dans .env')
            return res.status(500).json({ message: 'Erreur serveur : configuration manquante.' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        let utilisateur
        switch (decoded.role) {
            case 'ADMIN':
                utilisateur = await prisma.admin.findUnique({ where: { id: decoded.id } })
                break
            case 'MEDECIN':
                utilisateur = await prisma.medecin.findUnique({ where: { id: decoded.id } })
                break
            case 'PATIENT':
                utilisateur = await prisma.patient.findUnique({ where: { id: decoded.id } })
                break
            default:
                return res.status(400).json({ message: 'Rôle inconnu dans le token.' })
        }

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' })
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        }

        next()

    } catch (error) {
        console.error('Erreur d\'authentification :', error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' })
        }
        return res.status(401).json({ message: 'Token invalide.' })
    }
}

export const adminOnly = (req, res, next) => {
  const user = req.user

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Réservé aux administrateurs.',
    });
  }

  next()
}

export const medecinOnly = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'MEDECIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Réservé aux médecins.',
    });
  }

  next()
}
