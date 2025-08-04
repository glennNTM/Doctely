-- CreateEnum
CREATE TYPE "public"."Groupesanguin" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "public"."StatutDemande" AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'EXPIRE');

-- CreateEnum
CREATE TYPE "public"."TypeRdv" AS ENUM ('EN_PERSONNE', 'TELECONSULTATION');

-- CreateEnum
CREATE TYPE "public"."StatutRdv" AS ENUM ('PLANIFIE', 'REALISE', 'ANNULE');

-- CreateEnum
CREATE TYPE "public"."Specialite" AS ENUM ('GENERALISTE', 'CARDIOLOGUE', 'DERMATOLOGUE', 'GYNECOLOGUE', 'PSYCHOLOGUE', 'NEUROLOGUE', 'OPHTALMOLOGUE', 'PEDIATRE', 'DENTISTE');

-- CreateEnum
CREATE TYPE "public"."Genre" AS ENUM ('HOMME', 'FEMME');

-- CreateEnum
CREATE TYPE "public"."TypeUtilisateur" AS ENUM ('PATIENT', 'MEDECIN', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupeSanguin" "public"."Groupesanguin",
    "dateNaissance" TIMESTAMP(3),
    "genre" "public"."Genre",
    "historiqueMedical" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medecin" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialite" "public"."Specialite" NOT NULL,
    "certificat" TEXT NOT NULL,

    CONSTRAINT "Medecin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemandeConsultation" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "motif" TEXT NOT NULL,
    "specialite" "public"."Specialite" NOT NULL,
    "statut" "public"."StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateDemande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medecinId" INTEGER,

    CONSTRAINT "DemandeConsultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rendezvous" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TEXT NOT NULL,
    "statut" "public"."StatutRdv" DEFAULT 'PLANIFIE',
    "type" "public"."TypeRdv" NOT NULL DEFAULT 'EN_PERSONNE',
    "motif" TEXT NOT NULL,
    "specialite" "public"."Specialite" NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "demandeId" INTEGER,

    CONSTRAINT "Rendezvous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ordonnance" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT,
    "format" TEXT,
    "fichierUrl" TEXT,
    "codeQr" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rendezVousId" INTEGER NOT NULL,

    CONSTRAINT "Ordonnance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "contenu" TEXT,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "destinataireId" INTEGER NOT NULL,
    "typeDestinataire" "public"."TypeUtilisateur" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemandeMedecin" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "specialite" "public"."Specialite" NOT NULL,
    "certificat" TEXT NOT NULL,
    "motivation" TEXT,
    "statut" "public"."StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateDemande" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateValidation" TIMESTAMP(3),
    "adminId" INTEGER,

    CONSTRAINT "DemandeMedecin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "public"."Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_email_key" ON "public"."Medecin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ordonnance_rendezVousId_key" ON "public"."Ordonnance"("rendezVousId");

-- AddForeignKey
ALTER TABLE "public"."DemandeConsultation" ADD CONSTRAINT "DemandeConsultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DemandeConsultation" ADD CONSTRAINT "DemandeConsultation_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "public"."Medecin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rendezvous" ADD CONSTRAINT "Rendezvous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rendezvous" ADD CONSTRAINT "Rendezvous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "public"."Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rendezvous" ADD CONSTRAINT "Rendezvous_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "public"."DemandeConsultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ordonnance" ADD CONSTRAINT "Ordonnance_rendezVousId_fkey" FOREIGN KEY ("rendezVousId") REFERENCES "public"."Rendezvous"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "fk_patient_notification" FOREIGN KEY ("destinataireId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "fk_medecin_notification" FOREIGN KEY ("destinataireId") REFERENCES "public"."Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "fk_admin_notification" FOREIGN KEY ("destinataireId") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DemandeMedecin" ADD CONSTRAINT "DemandeMedecin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
