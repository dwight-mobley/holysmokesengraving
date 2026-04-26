import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({ error: err.flatten() });
    return;
  }

  // Prisma known errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025': // record not found
        res.status(404).json({ error: 'Resource not found' });
        return;
      case 'P2002': // unique constraint violation
        res.status(409).json({ error: 'Resource already exists' });
        return;
      default:
        res.status(400).json({ error: 'Database error' });
        return;
    }
  }

  // App errors with explicit statusCode
  if (err instanceof Error && (err as AppError).statusCode) {
    res.status((err as AppError).statusCode!).json({ error: err.message });
    return;
  }

  // Unknown errors — hide details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err instanceof Error ? err.message : String(err);

  res.status(500).json({ error: message });
}