# Holy Smokes Engraving — Web

Next.js 16 storefront and admin interface for the HolysmokesEngraving e-commerce platform.

## Tech Stack

- **Next.js 16** (App Router) — SSG/ISR server components
- **React 19** — UI components
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Zustand v5** — cart state, persisted to localStorage
- **React Hook Form + Zod** — checkout and auth form validation
- **Stripe** — Checkout session integration
- **PostHog** — product analytics and page view tracking
- **Sentry** — frontend error monitoring
- **Storybook 10** — component development and docs
- **Vitest** — unit and component tests
- **Playwright** — E2E tests (checkout, admin, POS flows)

## Prerequisites

- Node.js 20 LTS or later
- npm 10+
- API running at `http://localhost:4000` (see `apps/api`)

## Environment Setup

Create `apps/web/.env`:

```env
# API
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT (must match apps/api)
JWT_SECRET=<random-secret>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_API_KEY=<same-as-api>

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# E2E tests
PLAYWRIGHT_BASE_URL=http://localhost:3000
E2E_USER_EMAIL=e2e-playwright@example.com
E2E_USER_PASSWORD=Test1234!
```

## Getting Started

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Start dev server on port 3000      |
| `npm run build`           | Production build                   |
| `npm run start`           | Serve production build             |
| `npm run lint`            | Run ESLint                         |
| `npm test`                | Run Vitest unit/component tests    |
| `npm run test:ui`         | Run tests with Vitest UI           |
| `npm run test:e2e`        | Run Playwright E2E tests           |
| `npm run test:e2e:ui`     | Run Playwright tests with UI       |
| `npm run test:e2e:debug`  | Run Playwright tests in debug mode |
| `npm run storybook`       | Start Storybook on port 6006       |
| `npm run build-storybook` | Build static Storybook             |

## Project Structure

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Shared UI components (client components marked 'use client')
  schemas/      # Frontend Zod schemas
  store/        # Zustand cart store
  types/        # TypeScript types
  utils/        # formatMoney, analytics helpers
  stories/      # Storybook stories and component tests
e2e/            # Playwright E2E tests
```

## Key Pages

| Route               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `/`                 | Home / hero with featured items                      |
| `/shop`             | Product listing with search, filters, and pagination |
| `/shop/[slug]`      | Product detail page                                  |
| `/cart`             | Cart with quantity controls                          |
| `/checkout`         | Stripe Checkout session redirect                     |
| `/checkout/success` | Order confirmation                                   |
| `/login`            | Customer login                                       |
| `/register`         | Customer registration                                |
| `/dashboard`        | Customer order history and profile                   |
| `/gallery`          | Product/work gallery                                 |
| `/custom-order`     | Custom engraving request form                        |
| `/about`            | About page                                           |
| `/privacy`          | Privacy policy                                       |
| `/terms`            | Terms of service                                     |
| `/admin`            | Admin dashboard (API key protected)                  |
| `/admin/products`   | Product management (list, create, edit, delete)      |
| `/admin/orders`     | Order management with status updates                 |
| `/admin/pos`        | In-person POS cart and checkout                      |
| `/admin/analytics`  | Sales and inventory analytics                        |
