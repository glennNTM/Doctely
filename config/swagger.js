// config/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Importe tous les commentaires Swagger
import "../docs/index.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Doctely",
            version: "1.0.0",
            description: "Documentation de l'API Doctely",
        },
        servers: [
            {
                url: "http://localhost:5500",
            },
        ],
    },
    apis: ["./docs/**/*.js"], // centralisation ici
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
