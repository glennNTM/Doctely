import multer from "multer";
import path from "path";
import fs from "fs-extra";

// Créer le dossier uploads s'il n'existe pas
const uploadDir = "./uploads/certificats";
fs.ensureDirSync(uploadDir);

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique : timestamp + nom original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `certificat-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtre pour n'accepter que les PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
});

export default upload;
