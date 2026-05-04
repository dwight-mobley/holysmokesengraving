import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace';
import { logger } from '../lib/logger'; // add this

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    // Validation errors are expected — log at warn, not error
    req.log.warn({ validation: err.flatten() }, 'Validation failed');
    res.status(400).json({ error: err.flatten() });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    req.log.warn({ prismaCode: err.code }, 'Prisma error');
    switch (err.code) {
      case 'P2025':
        res.status(404).json({ error: 'Resource not found' });
        return;
      case 'P2002':
        res.status(409).json({ error: 'Resource already exists' });
        return;
      default:
        res.status(400).json({ error: 'Database error' });
        return;
    }
  }

  if (err instanceof Error && (err as AppError).statusCode) {
    req.log.warn({ statusCode: (err as AppError).statusCode }, err.message);
    res.status((err as AppError).statusCode!).json({ error: err.message });
    return;
  }

  // Unexpected server errors — log full stack
  logger.error({ err }, 'Unhandled error');
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: message });
}