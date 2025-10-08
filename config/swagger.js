// config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Importe tous les commentaires Swagger
import '../docs/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Doctely',
      version: '1.0.0',
      description: 'Documentation de l\'API Doctely',
    },
    servers: [
      {
        url: 'http://localhost:10000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://doctely.netlify.app',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./docs/**/*.js'], // centralisation ici
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = app => {
  // Configuration Swagger UI avec options pour les tests
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      requestInterceptor: req => {
        // Ajouter automatiquement les headers CORS
        req.headers['Access-Control-Allow-Origin'] = '*';
        req.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        req.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        return req;
      },
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  console.log('Documentation Swagger disponible sur: http://localhost:10000/api-docs');
};
