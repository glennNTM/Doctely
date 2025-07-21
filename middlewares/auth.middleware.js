import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

/**
 * Middleware pour vérifier l'authentification de l'utilisateur via JWT.
 * Attache l'utilisateur décodé (id, email, role) à `req.user`.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {Function} next - La fonction middleware suivante.
 */
export const authenticate = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
    }

    try {
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attache les informations de l'utilisateur décodées à l'objet de requête
        next();
    } catch (error) {
        console.error('Erreur d\'authentification :', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
        }
        return res.status(401).json({ message: 'Token invalide.' });
    }
};

/**
 * Middleware pour vérifier si l'utilisateur authentifié est un administrateur.
 * Nécessite que le middleware `authenticate` ait été exécuté avant.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {Function} next - La fonction middleware suivante.
 */
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs sont autorisés.' });
    }
    next();
};