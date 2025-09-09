import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import offersRouter from './routes/offers';
import {
  globalErrorHandler,
  notFoundHandler
} from './middleware/error.middleware';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { createGracefulShutdown, setupSignalHandlers } from './utils/shutdown';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Pino HTTP logger with custom configuration
app.use(pinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
  }
}));

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

// Start server and store reference for graceful shutdown
const server = app.listen(port, () => {
  logger.info(`🚀 SOF API server listening on port ${port}`);
  logger.info(`📚 API Documentation available at http://localhost:${port}/api-docs`);
  logger.info(`🔍 Health check available at http://localhost:${port}/health`);
});

// Setup graceful shutdown
const { gracefulShutdown } = createGracefulShutdown(server, {
  timeout: 30000,
  cleanup: async () => {
    // Add any custom cleanup logic here
    // For example: close database connections, clear caches, etc.
    logger.info('🧹 Performing custom cleanup...');
  }
});

// Register signal handlers
setupSignalHandlers(gracefulShutdown);

export default app;
