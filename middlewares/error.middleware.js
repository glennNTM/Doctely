

/**
 * Middleware global de gestion d'erreurs Prisma
 */
const errorMiddleware = (err, req, res) => {
  console.error('🛑 Erreur interceptée :', err);

  let statusCode = 500;
  let message = 'Erreur serveur. Veuillez réessayer plus tard.';

  // 🎯 Erreurs Prisma spécifiques
  // eslint-disable-next-line no-undef
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        // Contrainte unique violée
        message = `Une valeur dupliquée a été détectée pour le champ : ${err.meta?.target?.join(', ')}`;
        statusCode = 400;
        break;

      case 'P2025':
        // Requête de modification sur une ressource inexistante
        message = `La ressource demandée est introuvable ou déjà supprimée.`;
        statusCode = 404;
        break;

      case 'P2003':
        // Violation de contrainte de clé étrangère
        message = `La ressource liée est invalide ou n'existe pas (clé étrangère).`;
        statusCode = 400;
        break;

      case 'P2010':
        // Erreur liée à la base (ex. : SQL invalide)
        message = `Requête invalide.`;
        statusCode = 400;
        break;

      case 'P2014':
        message = `Violation de contrainte de relation.`;
        statusCode = 400;
        break;

      case 'P2016':
        message = `Le chemin de la requête est invalide.`;
        statusCode = 400;
        break;

      default:
        message = `Erreur Prisma (code ${err.code})`;
        statusCode = 500;
        break;
    }
  }

  // 📋 Erreurs de validation des données
  // eslint-disable-next-line no-undef
  else if (err instanceof Prisma.PrismaClientValidationError) {
    message = `Données invalides envoyées à la base.`;
    statusCode = 400;
  }

  // ❓ Erreurs inconnues de Prisma
  // eslint-disable-next-line no-undef
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = `Erreur inconnue côté Prisma.`;
    statusCode = 500;
  }

  // 📦 Erreurs génériques JS (ex: JSON invalide)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    message = 'Requête mal formée (JSON invalide).';
    statusCode = 400;
  }

  // ✅ Réponse finale
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorMiddleware;
