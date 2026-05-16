# Holy Smokes Engraving — API

Express 5 + TypeScript REST API backed by a [Supabase](https://supabase.com) hosted Postgres database.

## Tech Stack

- **Express 5** — REST API with Zod request validation middleware
- **Prisma v7** — ORM with migrations; client output at `src/generated/prisma`
- **Postgres (Supabase)** — hosted database
- **Stripe** — Checkout session creation and webhook processing
- **Resend + React Email** — transactional email templates
- **Cloudinary** — product image uploads
- **JWT (`jsonwebtoken`)** — customer authentication
- **bcrypt** — password hashing
- **pino + pino-http** — structured request logging
- **Sentry** — error monitoring
- **Vitest** — integration tests

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (or any Postgres instance)
- Stripe account with test keys
- Resend account and API key
- Cloudinary account

## Environment Setup

Create `apps/api/.env`:

```env
# Database
DATABASE_URL=<your-postgres-connection-string>

# Admin
ADMIN_API_KEY=<random-secret>
ADMIN_EMAIL=<admin-email-address>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# JWT
JWT_SECRET=<random-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Sentry
SENTRY_DSN=<your-dsn>

# POS
POS_TAX_RATE_PERCENT=8
INVOICE_MAILING_ADDRESS=<your-mailing-address>
```

## Getting Started

```bash
cd apps/api
npm install

# Run DB migrations
npm run db:migrate

# Start dev server (hot reload)
npm run dev
```

API listens on [http://localhost:4000](http://localhost:4000).

## Available Scripts

| Script                | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start API with hot reload    |
| `npm run build`       | Compile TypeScript           |
| `npm run start`       | Serve compiled build         |
| `npm test`            | Run Vitest integration tests |
| `npm run test:watch`  | Run Vitest in watch mode     |
| `npm run db:generate` | Regenerate Prisma client     |
| `npm run db:migrate`  | Run Prisma migrations        |
| `npm run db:studio`   | Open Prisma Studio           |
| `npm run db:backup`   | Run DB backup script         |

## Project Structure

```
src/
  app.ts            # Express app setup (middleware, routes)
  index.ts          # Server entry point
  instrument.ts     # Sentry instrumentation
  routes/
    admin.ts        # Admin product/order management (API key protected)
    auth.ts         # Register, login, /me
    contact.ts      # Contact form submissions
    customer.ts     # Customer profile and order history
    customOrders.ts # Custom engraving order requests
    orders.ts       # Order creation and lookup
    products.ts     # Product listing and detail
    stripe.ts       # Checkout session + webhook handler
  middleware/
    errorHandler.ts # Global error handler
    requireAdmin.ts # API key guard for admin routes
    requireAuth.ts  # JWT guard for customer routes
    validate.ts     # Zod request validation middleware
  emails/
    templates/      # React Email templates
      OrderConfirmation.tsx
      AdminNewOrder.tsx
      OrderShipped.tsx
      CustomOrderConfirmation.tsx
      CustomOrderRequest.tsx
      ContactMessage.tsx
      POSInvoice.tsx
  lib/              # Prisma client, email service, Cloudinary config
  generated/        # Prisma generated client
```

## API Routes

### Public

| Method | Path               | Description                       |
| ------ | ------------------ | --------------------------------- |
| GET    | `/products`        | List products (paginated)         |
| GET    | `/products/:slug`  | Get product by slug               |
| POST   | `/auth/register`   | Register a new customer           |
| POST   | `/auth/login`      | Login; returns JWT                |
| POST   | `/stripe/checkout` | Create a Stripe Checkout session  |
| POST   | `/stripe/webhook`  | Handle Stripe webhook events      |
| POST   | `/contact`         | Submit a contact form message     |
| POST   | `/custom-orders`   | Submit a custom engraving request |

### Authenticated (JWT required)

| Method | Path             | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/auth/me`       | Get current customer |
| GET    | `/customers/:id` | Get customer profile |
| GET    | `/orders/:id`    | Get order details    |

### Admin (API key or JWT ADMIN ROLE required)

| Method | Path                       | Description                    |
| ------ | -------------------------- | ------------------------------ |
| GET    | `/admin/products`          | List all products              |
| POST   | `/admin/products`          | Create product                 |
| PUT    | `/admin/products/:id`      | Update product                 |
| DELETE | `/admin/products/:id`      | Delete product                 |
| GET    | `/admin/orders`            | List all orders                |
| GET    | `/admin/orders/:id`        | Get order details              |
| PATCH  | `/admin/orders/:id/status` | Update order status + tracking |
| POST   | `/admin/pos/orders`        | Create POS order (in-person)   |
| GET    | `/admin/analytics`         | Sales and inventory analytics  |

## Key Conventions

- All money values are integers in **cents** — never floats
- All request bodies validated with Zod via `validate` middleware
- Multi-table DB operations use `prisma.$transaction`
- Structured logs use `req.log` (pino-http) in route handlers; `logger` directly elsewhere
- Webhook events are idempotency-guarded via `stripeSessionId` unique constraint
