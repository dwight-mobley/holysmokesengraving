# HolysmokesEngraving E-Commerce & POS — Project Timeline

## Overview

**Stack:** TypeScript, Next.js, React, Node/Express, Postgres, Stripe, Resend, Docker, GitHub Actions
**Goal:** Build a full-stack e-commerce storefront and in-person POS system for HolysmokesEngraving — production-ready, portfolio-grade.

---

## Phase 1: Foundation — TypeScript, Tooling & CI

**Status: ✅ Complete**

- [x] Create repo, add `.gitignore`, `README.md`, `.env.example`
- [x] Install Node.js LTS, VS Code extensions (TS, ESLint, Prettier)
- [x] TypeScript fundamentals: types, interfaces, generics, utility types, strict config
- [x] Build typed utility library (`formatMoney`, slug generator, ID generator); add unit tests
- [x] Configure ESLint + Prettier + Husky pre-commit hooks
- [x] Git workflow: branch naming, PR template, commit conventions; `main`/`dev` branches
- [x] Install Jest + ts-jest; write unit tests for utility functions
- [x] Create CI skeleton `.github/workflows/ci.yml` (lint + test)
- [x] API typing patterns: DTOs, Zod validation, mapped types

**✅ Milestone:** Repo standards established, strict TypeScript, CI running, utility library tested.

---

## Phase 2: Storefront UI & Component Library

**Status: ✅ Complete**

- [x] Scaffold Next.js + TypeScript app (`apps/web`); add Tailwind CSS and design tokens
- [x] Create base layout, navigation, global styles
- [x] Install Storybook; build core components (Button, Card, Input, Navbar, Footer, ProductCard)
- [x] Build product listing page (static data, responsive grid, search + filter, debounce)
- [x] Build product detail page (image, price, add to cart, SEO meta)
- [x] Add cart state (Zustand); add/remove/update quantity; persist to localStorage
- [x] Build checkout UI with React Hook Form + Zod validation
- [x] Add login/register UI skeletons
- [x] Add analytics event stubs
- [x] Accessibility checks and Lighthouse performance checks
- [x] Write component tests; create component library README
- [x] Deploy preview to Vercel

**✅ Milestone:** Production-grade component library, storefront UI, cart UX, and checkout form.

---

## Phase 3: Backend API & Database

**Status: ✅ Complete**

- [x] Scaffold Express + TypeScript API (`apps/api`)
- [x] Dockerize Postgres via `docker-compose`
- [x] Install Prisma; create schema: `Product`, `Customer`, `Order`, `OrderItem`
- [x] Create seed script; verify data in DB
- [x] Add DB migrations
- [x] Implement `GET /products` with pagination
- [x] Implement `GET /products/:slug`
- [x] Implement `POST /orders` with transactional safety
- [x] Implement customer endpoints (create/fetch); email normalization
- [x] Implement admin endpoints: product CRUD, order status updates; protect with API key
- [x] Add inventory decrement logic inside DB transactions
- [x] Add request validation middleware (Zod)
- [x] Add error handling middleware
- [x] Add structured logging (pino)
- [x] Add DB backup script
- [x] Write integration tests against local DB
- [x] Deploy API to staging (Render)
- [x] Document DB schema in `docs/schema.md`

**✅ Milestone:** Stable API with Postgres, migrations, seed data, admin endpoints, and structured logging.

---

## Phase 4: API Integration — Connect Frontend to Live Backend

**Status: 🔄 In Progress**

- [x] Connect product detail page (`/shop/[slug]`) to `GET /products/:slug`
- [ ] Connect shop listing page (`/shop`) to `GET /products`
- [ ] Remove static `data/products.ts` file
- [ ] Wire checkout form to live `POST /api/checkout` Stripe session endpoint
- [ ] Add `NEXT_PUBLIC_APP_URL` / `API_URL` environment variables; update Vercel config
- [ ] Verify ISR revalidation works end-to-end on Vercel

**✅ Milestone:** Storefront fully powered by live API; no static data remaining.

---

## Phase 5: Stripe Checkout & Webhooks

**Status: ✅ Complete**

- [x] Create Stripe account/test keys; map catalog to Stripe products/prices
- [x] Implement `POST /checkout` — create Stripe Checkout session with metadata
- [x] Implement webhook endpoint (`checkout.session.completed`); verify signatures
- [x] On webhook: upsert customer, create order in Postgres, decrement inventory
- [x] Idempotency guard: skip duplicate webhook events via `stripeSessionId` unique constraint
- [x] Distinguish retryable vs. non-retryable webhook errors
- [ ] Test with Stripe CLI (send test events)
- [ ] End-to-end test: Stripe test card → order appears in DB

**✅ Milestone:** Live Stripe Checkout with secure webhook processing and transactional order creation.

---

## Phase 6: Transactional Email

**Status: ✅ Complete**

- [x] Set up Resend account and API key
- [x] Build email service module (`sendEmail` with error handling)
- [x] Build `OrderConfirmation` React Email template (logo, line items, totals, shipping address)
- [x] Build `AdminNewOrder` React Email template (admin alert on new order)
- [x] Build `OrderShipped` React Email template (tracking number notification)
- [x] Hook order confirmation into webhook flow (sent after order creation)
- [x] Hook admin alert into webhook flow
- [x] Hook shipping notification into admin order status update (`PATCH /orders/:id/status`)
- [ ] Test deliverability end-to-end (test inboxes, links, formatting)

**✅ Milestone:** Transactional email system integrated with order lifecycle.

---

## Phase 7: Auth & Customer Accounts

**Status: 🔲 Not Started**

- [ ] Add auth endpoints to API: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- [ ] Issue JWT on login; add auth middleware to protect customer routes
- [ ] Add `passwordHash` field to `Customer` model; migrate DB
- [ ] Implement NextAuth (or custom session) on the frontend
- [ ] Wire `LoginClient` and `RegisterClient` to live auth endpoints
- [ ] Add protected route middleware in Next.js (`middleware.ts`)
- [ ] Build customer dashboard: order history, profile details
- [ ] Post-order success prompt: "Create an account to track your orders"
- [ ] Add auth integration tests

**✅ Milestone:** Guest checkout remains default; customers can optionally create accounts to view order history.

---

## Phase 8: Admin UI & Point of Sale

**Status: 🔲 Not Started**

### Admin Dashboard

- [ ] Create `/admin` app section with separate admin auth (API key or admin JWT)
- [ ] Admin login page + protected route guard
- [ ] Product management: list, create, edit, delete (calls `apps/api` admin endpoints)
- [ ] Order management: list all orders, filter by status, view order details
- [ ] Update order status + add tracking number (triggers shipping email)
- [ ] Inventory dashboard: current stock levels, low-stock indicators

### Point of Sale

- [ ] In-person cart builder: search products, add to cart, adjust quantities
- [ ] Customer lookup by email; create new customer inline
- [ ] Order summary with subtotal, tax, and total
- [ ] Charge via Stripe Terminal (card-present) or manual charge link
- [ ] On payment: create order via API, decrement inventory, send confirmation email
- [ ] Receipt: email to customer or print-friendly view

**✅ Milestone:** Full admin dashboard and in-person POS system sharing the same API and inventory as the online storefront.

---

## Phase 9: Infrastructure & Docker

**Status: 🔲 Not Started**

- [ ] Write Dockerfiles for `apps/api` and `apps/web`
- [ ] Update `docker-compose.yml` (API + Postgres + optional Redis); add volumes and env examples
- [ ] Add health checks and seed-on-startup script
- [ ] Configure Cloudflare Tunnel (or ngrok) for secure local webhook testing
- [ ] Test full webhook flow via tunnel + Stripe CLI
- [ ] Add Docker Compose overrides for dev vs. CI
- [ ] Document local dev workflow in `docs/local-dev.md`
- [ ] Run full local E2E test (storefront → checkout → webhook → email) inside Docker

**✅ Milestone:** Reproducible Docker environment; full E2E flow testable locally.

---

## Phase 10: CI/CD, Testing & Observability

**Status: 🔲 Not Started**

- [ ] Finalize GitHub Actions: `ci.yml` (lint + test), `deploy-web.yml` (Vercel), `deploy-api.yml` (container)
- [ ] Add branch protection rules on `main`
- [ ] Add E2E tests with Playwright (checkout happy path, admin order flow)
- [ ] Integrate Sentry for frontend and backend (environment tags, release tracking)
- [ ] Automate DB migrations in CI; document rollback plan
- [ ] Add Lighthouse CI for performance budgets
- [ ] Merge `dev` → `main`; run full pipeline to staging; verify smoke tests

**✅ Milestone:** Robust CI/CD, automated E2E tests, error monitoring, and clean deploy pipeline.

---

## Phase 11: Portfolio Polish, Case Study & Job Outreach

**Status: 🔲 Not Started**

- [ ] Deploy storefront and API to production
- [ ] Build portfolio page (`dwight-mobley.com`): hero, project cards, HolysmokesEngraving case study
- [ ] Write case study: problem, solution, architecture diagram, tech choices, metrics, lessons learned
- [ ] Record demo video: storefront → checkout → email + admin POS flow
- [ ] Create resume bullets from project achievements (metrics, stack, scope)
- [ ] Prepare 10–15 STAR behavioral stories tied to project work
- [ ] Prepare technical interview prompts (React/TS, API design, payments, auth)
- [ ] Create job application tracker; draft recruiter outreach templates
- [ ] Publish LinkedIn announcement post
- [ ] Apply to 10–20 targeted roles
- [ ] 🎉 Celebrate!

**✅ Milestone:** Live production app, polished portfolio case study, and active job search underway.

---

## Key Milestones

| Milestone                         | Status         |
| --------------------------------- | -------------- |
| Foundation & Tooling              | ✅ Complete    |
| Storefront UI & Component Library | ✅ Complete    |
| Backend API & Database            | ✅ Complete    |
| Frontend → API Integration        | 🔄 In Progress |
| Stripe Checkout & Webhooks        | ✅ Complete    |
| Transactional Email               | ✅ Complete    |
| Auth & Customer Accounts          | 🔲 Not Started |
| Admin UI & POS                    | 🔲 Not Started |
| Docker & Infrastructure           | 🔲 Not Started |
| CI/CD & Observability             | 🔲 Not Started |
| 🚀 Portfolio & Job Outreach       | 🔲 Not Started |

---

## Success Metrics

- [ ] Working end-to-end checkout flow (storefront → Stripe → webhook → email)
- [ ] In-person POS flow (cart → charge → order → email)
- [ ] Customer account creation and order history
- [ ] Automated tests passing in CI
- [ ] Deployed staging and production environments
- [ ] One polished case study with architecture diagram and demo video
- [ ] 10–20 targeted job applications submitted
