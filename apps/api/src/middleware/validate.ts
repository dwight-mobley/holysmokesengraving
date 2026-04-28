import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }
    req.body = parsed.data; // replace body with parsed/coerced data
    next();
  };
}