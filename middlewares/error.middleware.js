import multer from "multer"

export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Le fichier est trop volumineux. Taille maximum : 5MB",
      })
    }
  }

  if (error.message === "Seuls les fichiers PDF sont autorisés") {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  next(error)
}
