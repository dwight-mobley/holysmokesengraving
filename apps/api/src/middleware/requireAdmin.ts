import { Request, Response, NextFunction } from 'express';
import { requireAdmin } from './requireAuth';

export function requireAdminAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key = req.headers['x-api-key'];
  if (key && key === process.env.ADMIN_API_KEY) {
    next();
    return;
  }
  requireAdmin(req, res, next);
}
