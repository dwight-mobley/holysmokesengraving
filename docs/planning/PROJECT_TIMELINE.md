# HolysmokesEngraving E-Commerce Site — 90-Day Project Timeline

## Overview

**Commitment:** 12 weeks, 20+ hours/week
**Stack:** TypeScript, Next.js, React, Node/Express, Postgres, Stripe, SparkPost, Docker, GitHub Actions
**Goal:** Build HolysmokesEngraving e-commerce site from scratch and deploy to production.

---

## Phase 1: TypeScript Fundamentals & Git Hygiene (Weeks 1–2)

### Week 1 — Repo Setup, TypeScript Basics & Tooling (~22 hrs)
- [x] Create repo `dwight-mobley/holysmokesengraving`, add `.gitignore`, `README.md`, `.env.example`
- [x] Install Node.js LTS, pnpm/npm, VS Code extensions (TS, ESLint, Prettier)
- [x] TypeScript basics refresher: types, interfaces, unions, intersections (6–8 exercises)
- [x] Advanced TS: generics, utility types, conditional types; convert JS snippets to TS
- [x] Configure ESLint + Prettier + Husky pre-commit hooks; add `lint` and `format` scripts
- [x] Git workflow: branch naming, PR template, commit conventions; create `main`/`dev` branches
- [x] Install Jest + ts-jest; write 3 unit tests for utility functions (slug, money, ID generator)
- [x] Create CI skeleton `.github/workflows/ci.yml` (lint + test)
- [x] Write `docs/day1-notes.md` journal entry
- [x] Push first commit

### Week 2 — Advanced TypeScript & CI (~20 hrs)
- [X] Deep dive: strict compiler options (`strict`, `noImplicitAny`, `exactOptionalPropertyTypes`)
- [X] Build typed utility library (money formatting, slug generator); add tests
- [X] TypeScript patterns for React: typed props, custom hooks
- [X] API typing patterns: DTOs, validation with Zod, mapping DB rows to types
- [X] Update CI to run lint + tests on PR
- [X] Set up GitHub Projects board; create issues for Week 3 tasks
- [X] Document TS learnings in `docs/ts-notes.md`
- [X] Write Week 2 journal entry

**✅ Milestone:** Confident TS usage, repo standards, CI skeleton, testing basics.

---

## Phase 2: React & Next.js Production Patterns (Weeks 3–5)

### Week 3 — Storefront UI & Component Library (~22 hrs)
- [X] Scaffold Next.js + TypeScript app (`apps/web`); add Tailwind CSS and design tokens
- [X] Create base layout, navigation, global styles
- [X] Install Storybook; build core components (Button, Card, Input, Navbar, Footer, ProductCard)
- [x] Build product listing page (static data, responsive grid)
- [x] Build product detail page (image gallery, variant selector, price display, SEO meta)
- [x] Add cart state (Zustand or Context); add/remove/update quantity; persist to localStorage
- [x] Accessibility checks and Lighthouse performance checks
- [x] Write component tests with Storybook
- [x] Deploy preview to Vercel
- [x] Write Week 3 journal entry

### Week 4 — Search, Checkout UI & Polish (~22 hrs)
- [x] Integrate image CDN (Cloudinary or S3); responsive `next/image` usage
- [x] Product filters and search (client-side); debounce and keyboard accessibility
- [x] Build checkout UI calling placeholder API for Stripe Checkout session
- [X] Add login/register skeleton (optional); guest checkout as default
- [ ] Add analytics event stubs; run Lighthouse performance checks
- [ ] Write Storybook component docs
- [ ] Update README with frontend setup instructions
- [ ] Write Week 4 journal entry

### Week 5 — Data Fetching, Validation & API Contracts (~20 hrs)
- [ ] Implement SSG for catalog, ISR for updates, SSR for cart/checkout pages
- [ ] Add client-side form validation with React Hook Form + Zod
- [ ] Add integration tests for critical flows (add to cart, product page)
- [ ] Create component library README
- [ ] Define API contracts for backend (OpenAPI sketch)
- [ ] Record 3-minute frontend walkthrough for portfolio
- [ ] Write Week 5 journal entry

**✅ Milestone:** Production-grade frontend with component library, SSG/SSR, cart UX, and test coverage.

---

## Phase 3: Backend APIs & Postgres (Weeks 6–7)

### Week 6 — API Scaffold, Schema & Core Endpoints (~22 hrs)
- [ ] Scaffold Express + TypeScript API (`apps/api`)
- [ ] Dockerize Postgres via `docker-compose`
- [ ] Install Prisma (or TypeORM); create schema: products, variants, customers, orders
- [ ] Create seed script (import product CSV/JSON); verify data in DB
- [ ] Add DB migrations
- [ ] Implement `GET /products` with pagination
- [ ] Implement `GET /products/:slug`
- [ ] Implement `POST /orders` (no payment yet); add transactional safety
- [ ] Add request validation middleware
- [ ] Add error handling middleware
- [ ] Write integration tests against local DB
- [ ] Deploy API to staging (Render, DigitalOcean, or Heroku)
- [ ] Write Week 6 journal entry

### Week 7 — Customers, Inventory & Admin (~20 hrs)
- [ ] Implement customer endpoints (create/fetch); email normalization
- [ ] Add inventory decrement logic (optimistic locking or DB transactions)
- [ ] Implement admin endpoints (CRUD products, order status updates); protect with API key or JWT
- [ ] Add DB backup script
- [ ] Add structured logging
- [ ] Document DB schema in `docs/schema.md`
- [ ] Write Week 7 journal entry

**✅ Milestone:** Stable API with Postgres, migrations, seed data, and admin endpoints.

---

## Phase 4: Stripe Checkout & Webhooks (Week 8)

### Week 8 — Payments End-to-End (~22 hrs)
- [ ] Create Stripe account/test keys; map catalog to Stripe products/prices
- [ ] Implement server endpoint to create Stripe Checkout session
- [ ] Implement webhook endpoint (`checkout.session.completed`, `payment_intent.succeeded`); verify signatures
- [ ] On webhook: create order in Postgres, decrement inventory, enqueue email notification
- [ ] Add idempotency keys and retry logic for webhook processing
- [ ] Test with Stripe CLI (send test events)
- [ ] End-to-end test: Stripe test card → order appears in admin
- [ ] Write Week 8 journal entry

**✅ Milestone:** Live Stripe Checkout flow with secure webhook processing and order creation.

---

## Phase 5: SparkPost Email Flows (Week 9)

### Week 9 — Transactional Email (~20 hrs)
- [ ] Create SparkPost account/API keys; set up transactional templates (order confirmation, shipping)
- [ ] Implement email service module with retry and templating
- [ ] Hook email into webhook flow: send order confirmation after order creation
- [ ] Send admin alert email for high-value orders
- [ ] Implement unsubscribe/email preference handling; log email events in DB
- [ ] Test deliverability (test inboxes, headers, templates, links)
- [ ] Add screenshots to case study
- [ ] Write Week 9 journal entry

**✅ Milestone:** Reliable transactional email system integrated with orders.

---

## Phase 6: Docker & Local Infrastructure (Week 10)

### Week 10 — Dockerize & Webhook Demo (~22 hrs)
- [ ] Create Dockerfiles for API and web
- [ ] Write `docker-compose.yml` (API + Postgres + Redis optional); add volumes and env examples
- [ ] Add health checks and seed-on-startup script
- [ ] Configure Cloudflare Tunnel (or ngrok) for secure local webhook testing
- [ ] Test webhook flow via tunnel + Stripe CLI; fix networking/signature issues
- [ ] Add Docker Compose overrides for dev and CI
- [ ] Document local dev workflow in `docs/local-dev.md`
- [ ] Optimize Dockerfiles (smaller images, caching)
- [ ] Run full local E2E test (frontend → checkout → webhook → email) inside Docker
- [ ] Write Week 10 journal entry

**✅ Milestone:** Reproducible Docker local environment and secure webhook demo.

---

## Phase 7: CI/CD, Tests & Observability (Week 11)

### Week 11 — Automation & Monitoring (~22 hrs)
- [ ] Finalize GitHub Actions: `ci.yml` (lint, test), `deploy-web.yml` (Vercel), `deploy-api.yml` (container); add branch protection
- [ ] Add E2E tests with Playwright or Cypress (checkout happy path); run in CI
- [ ] Integrate Sentry for frontend and backend (environment tags, release tracking)
- [ ] Automate DB migrations in CI; document rollback plan
- [ ] Add Lighthouse CI for performance budgets on main pages
- [ ] Merge `dev` → `main`; run full pipeline to staging; verify deploy and smoke tests
- [ ] Create runbook for incidents and on-call checklist
- [ ] Write Week 11 journal entry

**✅ Milestone:** Robust CI/CD, automated tests, monitoring, and deployable staging.

---

## Phase 8: Portfolio Polish, Case Study & Job Prep (Week 12)

### Week 12 — Launch & Career Prep (~20 hrs)
- [ ] Build portfolio page (`dwight-mobley.com`): hero, project cards, HolysmokesEngraving case study
- [ ] Write case study: problem, solution, architecture diagram, tech choices, metrics, lessons learned; add screenshots and demo video
- [ ] Create resume bullets from project achievements (metrics, stack, responsibilities)
- [ ] Prepare 10–15 STAR behavioral stories tied to project work
- [ ] Prepare 10 technical interview prompts (React/TS, API design)
- [ ] Create job application tracker; draft outreach templates for recruiters
- [ ] Deploy portfolio to production; verify all links
- [ ] Publish LinkedIn announcement post
- [ ] Apply to 10–20 targeted roles
- [ ] Write Week 12 journal entry
- [ ] 🎉 Celebrate!

**✅ Milestone:** Live portfolio with case study, resume updates, interview prep, and job outreach system.

---

## Weekly Routine & Metrics

| Activity | Hours/Week |
|---|---|
| Focused coding + tests | 12–15 |
| Learning + documentation | 3–4 |
| CI/ops + deployment | 2–3 |
| Job search/networking (Weeks 11–12) | 1–2 |

**Weekly checkpoints:** Push a demo branch, record a 2–3 minute demo video, update project board.

**Success metrics:**
- [ ] Working checkout flow (Stripe → order → email)
- [ ] Automated tests passing in CI
- [ ] Deployed staging and production environments
- [ ] One polished case study with architecture diagram
- [ ] 10–20 targeted job applications by end of Week 12

---

## Key Milestones

| Milestone | Target |
|---|---|
| TS Foundations & Repo Standards | End of Week 2 |
| Production Frontend Complete | End of Week 5 |
| API & Database Stable | End of Week 7 |
| Stripe Checkout Live | End of Week 8 |
| Email System Integrated | End of Week 9 |
| Docker Environment Ready | End of Week 10 |
| CI/CD & Monitoring Complete | End of Week 11 |
| 🚀 **Portfolio & Job Outreach** | End of Week 12 |