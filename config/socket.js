// config/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // ou ton frontend (ex: http://localhost:3000)
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Nouvelle connexion:", socket.id);

        // Gérer l’identification de l’utilisateur (par exemple avec son ID ou token)
        socket.on("register", (userId) => {
            console.log(`📌 Utilisateur enregistré: ${userId}`);
            socket.join(userId); // Crée une room par utilisateur
        });

        socket.on("disconnect", () => {
            console.log("🔴 Déconnexion:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io n’est pas initialisé !");
    }
    return io;
};
