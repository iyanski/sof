import pino from 'pino';

// Create a shared logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined
});

// Export child loggers for different modules
export const createModuleLogger = (module: string) => logger.child({ module });

/**
 * Class-based logger that can be instantiated in services
 */
export class Logger {
  private readonly pinoLogger: pino.Logger;

  constructor(context: string) {
    this.pinoLogger = logger.child({ context });
  }

  debug(message: string, meta?: object): void {
    this.pinoLogger.debug(meta, message);
  }

  info(message: string, meta?: object): void {
    this.pinoLogger.info(meta, message);
  }

  warn(message: string, meta?: object): void {
    this.pinoLogger.warn(meta, message);
  }

  error(message: string, meta?: object): void {
    this.pinoLogger.error(meta, message);
  }

  fatal(message: string, meta?: object): void {
    this.pinoLogger.fatal(meta, message);
  }
}

/**
 * Functional logger factory - creates loggers with context
 * Usage: const log = createLogger('MyService');
 */
export const createLogger = (context: string) => {
  const contextLogger = logger.child({ context });
  
  return {
    debug: (message: string, meta?: object) => contextLogger.debug(meta, message),
    info: (message: string, meta?: object) => contextLogger.info(meta, message),
    warn: (message: string, meta?: object) => contextLogger.warn(meta, message),
    error: (message: string, meta?: object) => contextLogger.error(meta, message),
    fatal: (message: string, meta?: object) => contextLogger.fatal(meta, message),
  };
};
