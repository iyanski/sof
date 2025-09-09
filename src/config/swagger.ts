import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SOF API - Shipment Offers & Logistics System',
      version: '1.0.0',
      description: 'A sophisticated shipment and logistics offer system that evaluates carrier eligibility using a multi-tier scoring algorithm with configurable business rules and comprehensive explainability.',
      contact: {
        name: 'Ian Bert Tusil',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    paths: {
      '/api/offers': {
        post: {
          summary: 'Get shipment offers from eligible carriers',
          description: 'Evaluates a shipment against all available carriers and returns offers from eligible carriers, sorted by cost and eligibility score.',
          tags: ['Offers'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OfferRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Successfully retrieved offers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Offer'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - Invalid shipment data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/dto/*.ts',    // Path to the DTO files with Swagger annotations
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SOF API Documentation',
  }));

  // JSON endpoint for the OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
