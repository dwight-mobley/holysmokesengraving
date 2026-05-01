# Holy Smokes Engraving — Copilot Instructions

## Project

Full-stack e-commerce storefront and in-person POS system for a laser engraving business.
**Stack:** TypeScript, Next.js (App Router), React, Node/Express, Postgres, Prisma, Stripe, Resend, Docker, GitHub Actions.

## Monorepo Structure

```
apps/api        — Express + TypeScript REST API
apps/web        — Next.js 15 App Router frontend
packages/shared — Shared Zod schemas, types, and utility functions
```

## Current Phase

**Phase 4 — API Integration (In Progress)**
Connecting the Next.js frontend to the live Express API. Previous phases (Foundation, Storefront UI, Backend API, Stripe, Email) are complete.

Upcoming: Auth & Customer Accounts → Admin UI & POS → Docker → CI/CD → Portfolio Launch.

See `docs/planning/PROJECT_TIMELINE.md` for the full phase breakdown.

## Tech Decisions

- **ESLint v9** flat config (`eslint.config.js`)
- **lint-staged** uses `.lintstagedrc.js` with function form (Windows path fix)
- **tsconfig** strict mode everywhere; `exactOptionalPropertyTypes` enabled
- **Jest + ts-jest** for unit/integration tests (root + `apps/api`)
- **Vitest** for `apps/web` tests
- **Prisma** ORM with generated client output at `apps/api/src/generated/prisma`
- **pino** for structured logging in the API
- **Zod** for all request validation (shared schemas in `packages/shared`)
- **Zustand** for cart state in the frontend
- **React Email + Resend** for transactional emails
- **Next.js 16 App Router** — server components fetch directly from `process.env.API_URL`; no proxy API routes

## API Conventions

- All routes validated with Zod middleware (`apps/api/src/middleware/validate.ts`)
- Admin routes protected with API key middleware (`requireApiKey`)
- Errors bubble to `errorHandler` middleware — never swallow errors that should return 4xx/5xx
- DB operations that touch multiple tables use `prisma.$transaction`
- Structured logs use `req.log` (pino-http) inside route handlers; `logger` directly elsewhere
- Money values are always integers in **cents** — never floats

## Frontend Conventions

- Pages in `apps/web/src/app/` follow Next.js App Router conventions
- Server components fetch data directly from `process.env.API_URL` (no `/api/` proxy)
- Client components are in `apps/web/src/components/` and marked `'use client'`
- Analytics calls (`analytics.productViewed`, etc.) must be fired from client components via `useEffect`
- `params` in dynamic routes is typed as `Promise<{ slug: string }>` and must be awaited (Next.js 15)
- `revalidate` is set at the page/route segment level, not on individual fetch calls

## Shared Package

- `packages/shared/src/schemas/` — Zod schemas for Product, Order, Customer
- `packages/shared/src/utils/` — `formatMoney`, `slugify`, etc.
- Import as `@hse/shared` in both `apps/api` and `apps/web`

## Email Templates

Located at `apps/api/src/emails/templates/`. Built with React Email components.

- `OrderConfirmation.tsx` — sent to customer after successful Stripe webhook
- `AdminNewOrder.tsx` — sent to admin on new order
- `OrderShipped.tsx` — sent to customer when order status set to `shipped`

`<Preview>` must be a direct child of `<Html>`, placed after `<Head />` and before `<Body>`.

## Commit Conventions

Conventional Commits format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `ci`, `style`

Examples:

- `feat(api): add auth endpoints`
- `fix(admin): send response on DELETE route`
- `docs: update timeline to reflect phases`

## Branch Naming

- `feature/<short-description>`
- `fix/<short-description>`

Examples: `feature/customer-auth`, `fix/delete-route-response`
