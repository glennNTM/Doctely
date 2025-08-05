import { v4 as uuidv4 } from "uuid"; // Pour générer un code QR unique
import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * @route   POST /api/ordonnances
 * @desc    Créer une ordonnance liée à un rendez-vous
 * @access  Medecin-only
 */
export const createOrdonnance = async (req, res) => {
  try {
    const medecinId = req.user.id; // Récupération de l’ID du médecin connecté
    const { contenu, format, rendezVousId } = req.body;

    // Vérification des champs requis
    if (!contenu || !rendezVousId) {
      return res.status(400).json({ error: "Contenu et rendezVousId requis." });
    }

    // Vérification que le rendez-vous existe et appartient au médecin
    const rdv = await prisma.rendezvous.findUnique({
      where: { id: rendezVousId },
      include: { medecin: true },
    });

    if (!rdv) {
      return res.status(404).json({ error: "Rendez-vous introuvable." });
    }

    if (rdv.medecinId !== medecinId) {
      return res.status(403).json({ error: "Accès interdit à ce rendez-vous." });
    }

    // Vérifier s’il y a déjà une ordonnance pour ce RDV
    const existing = await prisma.ordonnance.findUnique({
      where: { rendezVousId },
    });

    if (existing) {
      return res.status(409).json({ error: "Une ordonnance existe déjà pour ce rendez-vous." });
    }

    // Génération d’un code QR unique (UUID)
    const codeQr = uuidv4();

    // Création de l’ordonnance
    const ordonnance = await prisma.ordonnance.create({
      data: {
        contenu,
        format: format || "text",
        codeQr,
        rendezVous: {
          connect: { id: rendezVousId },
        },
      },
    });

    res.status(201).json({
      message: "Ordonnance créée avec succès.",
      ordonnance,
    });
  } catch (error) {
    console.error("Erreur création ordonnance :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * @route   GET /api/ordonnances/me
 * @desc    Récupérer toutes les ordonnances du patient connecté
 * @access  Patient-only
 */
export const getPatientOrdonnance = async (req, res) => {
  try {
    const patientId = req.user.id;

    const ordonnances = await prisma.ordonnance.findMany({
      where: {
        rendezVous: {
          patientId: patientId,
        },
      },
      include: {
        rendezVous: true,
      },
    });

    res.json({ ordonnances });
  } catch (error) {
    console.error("Erreur récupération ordonnances patient :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * @route   GET /api/ordonnances/me/medecin
 * @desc    Récupérer toutes les ordonnances créées par un médecin
 * @access  Medecin-only
 */
export const getMedecinOrdonnance = async (req, res) => {
  try {
    const medecinId = req.user.id;

    const ordonnances = await prisma.ordonnance.findMany({
      where: {
        rendezVous: {
          medecinId: medecinId,
        },
      },
      include: {
        rendezVous: true,
      },
    });

    res.json({ ordonnances });
  } catch (error) {
    console.error("Erreur récupération ordonnances médecin :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * @route   GET /api/ordonnances/:id/download
 * @desc    Télécharger une ordonnance en format PDF simulé
 * @access  Patient-only
 */
export const downloadOrdonnance = async (req, res) => {
  try {
    const patientId = req.user.id;
    const ordonnanceId = req.params.id;

    const ordonnance = await prisma.ordonnance.findUnique({
      where: { id: ordonnanceId },
      include: {
        rendezVous: true,
      },
    });

    if (!ordonnance) {
      return res.status(404).json({ error: "Ordonnance introuvable." });
    }

    if (ordonnance.rendezVous.patientId !== patientId) {
      return res.status(403).json({ error: "Accès interdit à cette ordonnance." });
    }

    // Simulation d’un fichier PDF
    const fileName = `ordonnance-${ordonnanceId}.txt`;
    const filePath = path.join("/tmp", fileName); // Pour démo locale
    const content = `Ordonnance :\n\n${ordonnance.contenu}\n\nQR Code: ${ordonnance.codeQr}`;

    fs.writeFileSync(filePath, content);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Erreur envoi du fichier :", err);
        res.status(500).json({ error: "Téléchargement échoué." });
      }
      // Optionnel : fs.unlinkSync(filePath); // Supprimer après envoi
    });
  } catch (error) {
    console.error("Erreur téléchargement ordonnance :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
