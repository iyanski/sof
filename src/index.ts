import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import offersRouter from './routes/offers';
import { globalErrorHandler, notFoundHandler, requestLogger } from './middleware/error.middleware';
import pinoHttp from 'pino-http';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp());

// Request logging middleware
app.use(requestLogger);

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'SOF API - Shipment Offers & Logistics System',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      offers: '/api/offers'
    }
  });
});

// API Routes
app.use('/api', offersRouter);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler for unknown routes (must be after all other routes)
app.use('*', notFoundHandler);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 SOF API server listening on port ${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
  // eslint-disable-next-line no-console
  console.log(`🔍 Health check available at http://localhost:${port}/health`);
});

export default app;
