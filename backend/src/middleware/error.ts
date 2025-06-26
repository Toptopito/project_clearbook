import { Request, Response, NextFunction } from 'express';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handles 404 errors for routes that don't exist
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(error);
};

// Global error handler
export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction): void => {
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;
  
  // If it's an instance of our ApiError, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'SequelizeValidationError') {
    // Handle Sequelize validation errors
    statusCode = 400;
    message = 'Validation Error';
    isOperational = true;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    // Handle database unique constraint errors
    statusCode = 409;
    message = 'Resource already exists';
    isOperational = true;
  }

  // Log error
  console.error(`[ERROR] ${new Date().toISOString()}:`, {
    error: err,
    request: {
      method: req.method,
      path: req.path,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user
    }
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
