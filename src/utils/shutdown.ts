import { Server } from 'http';
import { logger } from './logger';

/**
 * Graceful shutdown configuration
 */
export interface ShutdownConfig {
  /** Timeout in milliseconds before forcing shutdown (default: 30000) */
  timeout?: number;
  /** Custom cleanup function to run before shutdown */
  cleanup?: () => Promise<void> | void;
}

/**
 * Creates a graceful shutdown handler for the server
 * @param server - The HTTP server instance
 * @param config - Shutdown configuration options
 * @returns Object with shutdown function and signal handlers
 */
export const createGracefulShutdown = (server: Server, config: ShutdownConfig = {}) => {
  const { timeout = 30000, cleanup } = config;
  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
      logger.warn('🔄 Shutdown already in progress, ignoring signal');
      return;
    }

    isShuttingDown = true;
    logger.info(`📡 Received ${signal}. Starting graceful shutdown...`);

    try {
      // Run custom cleanup if provided
      if (cleanup) {
        logger.info('🧹 Running cleanup tasks...');
        await cleanup();
        logger.info('✅ Cleanup tasks completed');
      }

      // Stop accepting new connections
      server.close((err) => {
        if (err) {
          logger.error({
            message: '❌ Error during server shutdown',
            error: err
          });
          process.exit(1);
        }

        logger.info('✅ Server closed successfully');
        logger.info('👋 Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('⏰ Graceful shutdown timeout reached. Forcing exit...');
        process.exit(1);
      }, timeout);

    } catch (error) {
      logger.error({
        message: '💥 Error during graceful shutdown',
        error
      });
      process.exit(1);
    }
  };

  return {
    gracefulShutdown,
    isShuttingDown: () => isShuttingDown
  };
};

/**
 * Sets up process signal handlers for graceful shutdown
 * @param gracefulShutdown - The graceful shutdown function
 */
export const setupSignalHandlers = (gracefulShutdown: (signal: string) => void) => {
  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (err: Error) => {
    logger.error({
      message: '💥 Uncaught Exception',
      error: err
    });
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error({
      message: '💥 Unhandled Rejection',
      reason,
      promise
    });
    gracefulShutdown('unhandledRejection');
  });

  logger.info('🛡️ Signal handlers registered for graceful shutdown');
};
