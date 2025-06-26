import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Clearbook API Documentation',
    version,
    description: 'API documentation for the Clearbook personal health record application',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'Clearbook Support',
      url: 'https://clearbook.example.com',
      email: 'support@clearbook.example.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
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
  security: [{
    bearerAuth: [],
  }],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/docs/*.yaml'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
