-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupeSanguin" TEXT,
    "dateNaissance" DATETIME,
    "genre" TEXT,
    "historiqueMedical" TEXT
);

-- CreateTable
CREATE TABLE "Medecin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialite" TEXT NOT NULL,
    "certificat" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DemandeConsultation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "motif" TEXT NOT NULL,
    "specialite" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "dateDemande" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medecinId" INTEGER,
    CONSTRAINT "DemandeConsultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DemandeConsultation_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rendezvous" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "heure" TEXT NOT NULL,
    "statut" TEXT DEFAULT 'PLANIFIE',
    "type" TEXT NOT NULL DEFAULT 'EN_PERSONNE',
    "motif" TEXT NOT NULL,
    "specialite" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "demandeId" INTEGER,
    CONSTRAINT "Rendezvous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rendezvous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rendezvous_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "DemandeConsultation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ordonnance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contenu" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rendezVousId" INTEGER NOT NULL,
    CONSTRAINT "Ordonnance_rendezVousId_fkey" FOREIGN KEY ("rendezVousId") REFERENCES "Rendezvous" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "contenu" TEXT,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "destinataireId" INTEGER NOT NULL,
    "typeDestinataire" TEXT NOT NULL,
    CONSTRAINT "Notification_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DemandeMedecin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "specialite" TEXT NOT NULL,
    "certificat" TEXT NOT NULL,
    "motivation" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "dateDemande" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateValidation" DATETIME,
    "adminId" INTEGER,
    CONSTRAINT "DemandeMedecin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_email_key" ON "Medecin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ordonnance_rendezVousId_key" ON "Ordonnance"("rendezVousId");
