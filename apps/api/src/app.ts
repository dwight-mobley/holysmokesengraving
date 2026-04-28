import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { productRouter } from './routes/products';
import { orderRouter } from './routes/orders';
import { customerRouter } from './routes/customer';
import { adminRouter } from './routes/admin';
import { requireApiKey } from './middleware/requireApiKey';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';

export const app = express();

app.use(express.json());

// Pino Logger
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),
    customLogLevel: (_req, res) => {
      if (res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    redact: ['req.headers.authorization', 'req.headers["x-api-key"]'],
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} → ${res.statusCode}`,
    customErrorMessage: (_req, res, err) =>
      `Request failed with status ${res.statusCode}: ${err.message}`,
    // Only log id, method, url, and status code
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);
//Health Check Route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/customers', customerRouter);
app.use('/admin', requireApiKey, adminRouter);

app.use(errorHandler);
