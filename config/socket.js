// config/socket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env.js';

let io; // Variable globale pour stocker l'instance Socket.IO

/**
 * Initialise Socket.IO avec le serveur HTTP
 * @param {Object} server - Serveur HTTP Express
 */
export const initSocket = server => {
  // Création de l'instance Socket.IO avec CORS configuré
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://doctely.netlify.app'],
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization'],
    },
    transports: ['websocket', 'polling'],
  });

  // Middleware d'authentification
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('Token reçu:', token ? 'Présent' : 'Absent');

    if (!token) {
      console.log('Token manquant');
      return next(new Error('Token manquant'));
    }

    try {
      // Décoder le JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      console.log('Token valide pour user:', decoded.id);
      next();
    } catch (err) {
      console.log('Token invalide:', err.message);
      next(new Error('Token invalide'));
    }
  });

  // Gestion des connexions clients
  io.on('connection', socket => {
    console.log('Utilisateur connecté:', socket.userId);
    console.log('Socket ID:', socket.id);

    // Enregistrement d'un utilisateur dans sa room personnelle
    socket.on('register', userId => {
      socket.join(`user_${userId}`);
      console.log(`Utilisateur ${userId} rejoint sa room`);
    });

    // Gestion des déconnexions
    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté:', socket.userId);
    });
  });

  console.log('Socket.IO initialisé avec succès');
};

/**
 * Retourne l'instance Socket.IO pour envoyer des notifications
 * @returns {Object} Instance Socket.IO
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO n\'est pas initialisé ! Appelez initSocket() d\'abord.');
  }
  return io;
};
