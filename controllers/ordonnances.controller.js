import { v4 as uuidv4 } from "uuid"; // Pour générer un code QR unique
import { PrismaClient } from "../generated/prisma/index.js";
import fs from "fs";
import path from "path";
import { Readable } from "stream"


const prisma = new PrismaClient();

/**
 * @route   POST /api/ordonnances
 * @desc    Créer une ordonnance liée à un rendez-vous
 * @access  Medecin-only
 */
export const createOrdonnance = async (req, res) => {
  try {
    const medecinId = req.user.id; // ID du médecin connecté
    const { contenu, format, rendezVousId } = req.body;

    // Vérification des champs requis
    if (!contenu || !rendezVousId) {
      return res.status(400).json({ error: "Contenu et rendezVousId requis." });
    }

    const rdvId = Number(rendezVousId);
    if (Number.isNaN(rdvId)) {
      return res.status(400).json({ error: "rendezVousId invalide." });
    }

    // Vérifier que le RDV existe ET appartient au médecin
    const rdv = await prisma.rendezvous.findUnique({
      where: { id: rdvId },
      include: { medecin: true, patient: true },
    });

    if (!rdv) {
      return res.status(404).json({ error: "Rendez-vous introuvable." });
    }
    if (rdv.medecinId !== medecinId) {
      return res.status(403).json({ error: "Accès interdit à ce rendez-vous." });
    }

    // Vérifier s’il y a déjà une ordonnance pour ce RDV (contrainte @unique)
    const existing = await prisma.ordonnance.findUnique({
      where: { rendezVousId: rdvId },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Une ordonnance existe déjà pour ce rendez-vous." });
    }

    // Génération d’un code QR unique
    const codeQr = uuidv4();

    // Création de l’ordonnance
    const ordonnance = await prisma.ordonnance.create({
      data: {
        contenu,
        format: format || "text",
        codeQr,
        rendezVous: { connect: { id: rdvId } },
      },
      include: {
        rendezVous: {
          include: {
            patient: { select: { id: true, nom: true, prenom: true } },
            medecin: { select: { id: true, nom: true, prenom: true } },
          },
        },
      },
    });

    return res.status(201).json({
      message: "Ordonnance créée avec succès.",
      ordonnance,
    });
  } catch (error) {
    console.error("Erreur création ordonnance :", error);
    return res.status(500).json({ error: "Erreur serveur." });
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
        rendezVous: { patientId },
      },
      include: {
        rendezVous: {
          include: {
            patient: { select: { id: true, nom: true, prenom: true } },
            medecin: { select: { id: true, nom: true, prenom: true } },
          },
        },
      },
      orderBy: { dateCreation: "desc" },
    });

    return res.json({ ordonnances });
  } catch (error) {
    console.error("Erreur récupération ordonnances patient :", error);
    return res.status(500).json({ error: "Erreur serveur." });
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
        rendezVous: { medecinId },
      },
      include: {
        rendezVous: {
          include: {
            patient: { select: { id: true, nom: true, prenom: true } },
            medecin: { select: { id: true, nom: true, prenom: true } },
          },
        },
      },
      orderBy: { dateCreation: "desc" },
    });

    return res.json({ ordonnances });
  } catch (error) {
    console.error("Erreur récupération ordonnances médecin :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * @route   GET /api/ordonnances/:id/download
 * @desc    Télécharger une ordonnance en format PDF simulé (TXT)
 * @access  Patient-only
 */
export const downloadOrdonnance = async (req, res) => {
  try {
    const patientId = req.user.id;
    const ordonnanceId = Number(req.params.id);
    if (Number.isNaN(ordonnanceId)) {
      return res.status(400).json({ error: "Identifiant d’ordonnance invalide." });
    }

    const ordonnance = await prisma.ordonnance.findUnique({
      where: { id: ordonnanceId },
      include: {
        rendezVous: {
          include: {
            patient: { select: { nom: true, prenom: true } },
            medecin: { select: { nom: true, prenom: true } },
          },
        },
      },
    });

    if (!ordonnance) {
      return res.status(404).json({ error: "Ordonnance introuvable." });
    }
    if (ordonnance.rendezVous.patientId !== patientId) {
      return res.status(403).json({ error: "Accès interdit à cette ordonnance." });
    }

    // Générer le contenu de l’ordonnance
    const content = `Ordonnance médicale

Docteur : Dr. ${ordonnance.rendezVous.medecin.nom} ${ordonnance.rendezVous.medecin.prenom}
Patient : ${ordonnance.rendezVous.patient.nom} ${ordonnance.rendezVous.patient.prenom}

Contenu :
${ordonnance.contenu}

QR Code : ${ordonnance.codeQr ?? ""}
Date : ${new Date(ordonnance.dateCreation).toLocaleString()}
`;

    // Envoyer en tant que "fichier"
    res.setHeader("Content-Disposition", `attachment; filename=ordonnance-${ordonnanceId}.txt`);
    res.setHeader("Content-Type", "text/plain");

    const fileStream = Readable.from(content);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Erreur téléchargement ordonnance :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};