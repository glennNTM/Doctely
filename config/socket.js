// config/socket.js
import { Server } from "socket.io";

let io; // Variable globale pour stocker l'instance Socket.IO

/**
 * Initialise Socket.IO avec le serveur HTTP
 * @param {Object} server - Serveur HTTP Express
 */
export const initSocket = (server) => {
  // Création de l'instance Socket.IO avec CORS configuré
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:8080", "https://doctely.netlify.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Gestion des connexions clients
  io.on("connection", (socket) => {
    console.log("Nouvelle connexion:", socket.id);

    // Enregistrement d'un utilisateur dans sa room personnelle
    socket.on("register", (userId) => {
      console.log(`Utilisateur enregistré: ${userId}`);
      socket.join(userId.toString()); // Chaque utilisateur a sa propre room
    });

    // Gestion des déconnexions
    socket.on("disconnect", () => {
      console.log("Déconnexion:", socket.id);
    });
  });

  console.log("Socket.IO initialisé avec succès");
};

/**
 * Retourne l'instance Socket.IO pour envoyer des notifications
 * @returns {Object} Instance Socket.IO
 */
export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO n'est pas initialisé ! Appelez initSocket() d'abord."
    );
  }
  return io;
};
