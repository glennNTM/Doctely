-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DemandeMedecin" (
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
    "dateDemande" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "dateValidation" DATETIME,
    "adminId" INTEGER,
    CONSTRAINT "DemandeMedecin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DemandeMedecin" ("adminId", "adresse", "certificat", "dateDemande", "dateValidation", "email", "id", "motivation", "nom", "prenom", "specialite", "statut", "telephone") SELECT "adminId", "adresse", "certificat", "dateDemande", "dateValidation", "email", "id", "motivation", "nom", "prenom", "specialite", "statut", "telephone" FROM "DemandeMedecin";
DROP TABLE "DemandeMedecin";
ALTER TABLE "new_DemandeMedecin" RENAME TO "DemandeMedecin";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
