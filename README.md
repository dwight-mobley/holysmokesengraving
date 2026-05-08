# Holy Smokes Engraving

A full-stack, production-ready e-commerce platform and in-person POS system built with TypeScript, Next.js, Express, Postgres, Stripe, and Resend.

## Monorepo Structure

| Package           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `apps/web`        | Next.js 16 storefront (App Router, Tailwind CSS v4, Zustand) |
| `apps/api`        | Express 5 + TypeScript REST API (Prisma, Stripe, Resend)     |
| `packages/shared` | Shared Zod schemas, types, and utility functions             |

## Tech Stack

- **TypeScript** — strict mode throughout (`exactOptionalPropertyTypes` enabled)
- **Next.js 16** — App Router, SSG/ISR, server components
- **React 19** — UI components
- **Tailwind CSS v4** — custom design tokens
- **Zustand v5** — cart state with localStorage persistence
- **Express 5** — REST API with Zod request validation middleware
- **Postgres + Prisma v7** — database with migrations and seed script
- **Stripe** — Checkout sessions and secure webhook processing
- **Resend + React Email** — transactional email (order confirmation, admin alerts, shipping)
- **Cloudinary** — product image uploads
- **JWT** — customer auth (`jose` on the frontend, `jsonwebtoken` on the API)
- **pino** — structured logging in the API
- **Sentry** — error monitoring (frontend + backend)
- **Storybook 10** — component development and docs
- **Vitest** — unit/component tests (`apps/web`, `apps/api`)
- **Jest + ts-jest** — unit tests (root / shared package)
- **ESLint v9** — flat config; Prettier + Husky pre-commit hooks
- **GitHub Actions** — CI (lint + test)

## Getting Started

```bash
# Install all workspace dependencies
npm install

# Run the API
cd apps/api
npm run dev

# Run the frontend (separate terminal)
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

### Root

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm test`       | Run Jest unit tests (shared pkg) |
| `npm run lint`   | Lint `packages/shared/src`       |
| `npm run build`  | Compile `packages/shared`        |
| `npm run format` | Prettier format                  |

### `apps/api`

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start API with hot reload    |
| `npm run build`      | Compile TypeScript           |
| `npm test`           | Run Vitest integration tests |
| `npm run db:migrate` | Run Prisma migrations        |
| `npm run db:studio`  | Open Prisma Studio           |
| `npm run db:backup`  | Run DB backup script         |

### `apps/web`

| Script              | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start Next.js dev server     |
| `npm run build`     | Production build             |
| `npm test`          | Run Vitest tests             |
| `npm run storybook` | Start Storybook on port 6006 |

## Project Status

| Phase                             | Status         |
| --------------------------------- | -------------- |
| Foundation & Tooling              | ✅ Complete    |
| Storefront UI & Component Library | ✅ Complete    |
| Backend API & Database            | ✅ Complete    |
| Frontend → API Integration        | ✅ Complete    |
| Stripe Checkout & Webhooks        | ✅ Complete    |
| Transactional Email               | ✅ Complete    |
| Auth & Customer Accounts          | ✅ Complete    |
| Admin UI & POS                    | ✅ Complete    |
| CI/CD & Observability             | 🔄 In Progress |
| Portfolio & Job Outreach          | 🔲 Not Started |

See [docs/planning/PROJECT_TIMELINE.md](docs/planning/PROJECT_TIMELINE.md) for the full phase breakdown.
