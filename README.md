# Holy Smokes Engraving

A full-stack, production-ready e-commerce platform built with TypeScript, Next.js, Postgres, Stripe, and SparkPost.

## Packages

| Package    | Description                                               |
| ---------- | --------------------------------------------------------- |
| `apps/web` | Next.js 16 storefront (App Router, Tailwind CSS, Zustand) |

## Frontend (`apps/web`)

Next.js storefront with cart, checkout, product catalog, and Storybook component library.

See [apps/web/README.md](apps/web/README.md) for full setup instructions.

## Tech Stack

- **TypeScript** — strict mode throughout
- **Next.js 16** — App Router, SSG/SSR
- **React 19** — UI components
- **Tailwind CSS v4** — custom design tokens
- **Zustand v5** — cart state with localStorage persistence
- **Storybook 10** — component development and docs
- **Jest + ts-jest** — unit tests
- **ESLint + Prettier + Husky** — code quality and pre-commit hooks
- **GitHub Actions** — CI (lint + test)

## Planned Stack (Weeks 6–12)

- **Express + TypeScript** — REST API (`apps/api`)
- **Postgres + Prisma** — database and migrations
- **Stripe** — checkout and webhooks
- **SparkPost** — transactional email
- **Docker** — local dev environment
- **Playwright** — E2E tests
- **Sentry** — error monitoring

## Getting Started

```bash
# Install root dependencies (Jest, ESLint, Husky)
npm install

# Install and run the frontend
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts (root)

| Script           | Description         |
| ---------------- | ------------------- |
| `npm test`       | Run Jest unit tests |
| `npm run lint`   | Lint `src/`         |
| `npm run build`  | Compile TypeScript  |
| `npm run format` | Prettier format     |
