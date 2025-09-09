import { Request, Response, NextFunction } from 'express';
import { ValidationError as ClassValidatorError } from 'class-validator';
import { ErrorDto } from '../dto';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error class for DTO validation failures
 */
export class AppValidationError extends Error {
  public readonly statusCode: number = 400;
  public readonly details: string[];

  constructor(message: string, details: string[] = []) {
    super(message);
    this.details = details;
    this.name = 'ValidationError';
  }
}

/**
 * Global error handling middleware
 */
export const globalErrorHandler = (
  err: Error | AppError | AppValidationError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Log error for debugging
  // eslint-disable-next-line no-console
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
  });

  // Handle different types of errors
  if (err instanceof AppValidationError) {
    const errorResponse: ErrorDto = {
      error: 'ValidationError',
      message: err.message,
      details: err.details,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  if (err instanceof AppError) {
    const errorResponse: ErrorDto = {
      error: 'ApplicationError',
      message: err.message,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle class-validator errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (err.name === 'ValidationError' && Array.isArray((err as any).errors)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validationErrors = (err as any).errors as ClassValidatorError[];
    const errorDetails = validationErrors.map(error =>
      Object.values(error.constraints || {}).join(', ')
    );

    const errorResponse: ErrorDto = {
      error: 'ValidationError',
      message: 'Invalid request data provided',
      details: errorDetails,
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    const errorResponse: ErrorDto = {
      error: 'SyntaxError',
      message: 'Invalid JSON format in request body',
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Handle default server errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorResponse: ErrorDto = {
    error: 'InternalServerError',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
    ...(isDevelopment && { details: [err.stack || 'No stack trace available'] }),
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  const errorResponse: ErrorDto = {
    error: 'NotFoundError',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  };

  res.status(404).json(errorResponse);
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log request
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
