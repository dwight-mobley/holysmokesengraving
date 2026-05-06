import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { productRouter } from './routes/products';
import { orderRouter } from './routes/orders';
import { customerRouter } from './routes/customer';
import { adminRouter } from './routes/admin';
import { requireAdminAccess } from './middleware/requireAdmin';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';
import { stripeRouter } from './routes/stripe';
import { authRouter } from './routes/auth';
import { customOrderRouter } from './routes/customOrders';
import { contactRouter } from './routes/contact';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

export const app = express();

//For use with Render
app.set('trust proxy', 1);

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

//Stripe set raw buffer body for signature verification
app.use('/stripe', express.raw({ type: 'application/json' }), stripeRouter);

//Cors
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://holysmokesengraving.vercel.app',
    'https://holysmokesengraving.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));

// Set JSON parsing for other routes
app.use(express.json());

//RATE LIMIT
// Strict limiter for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for public form submissions
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});



//Health Check Route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/customers', customerRouter);
app.use('/auth', authLimiter, authRouter);
app.use('/admin', requireAdminAccess, adminRouter);
app.use('/custom-orders', formLimiter, customOrderRouter);
app.use('/contact',formLimiter, contactRouter);

app.use(errorHandler);
