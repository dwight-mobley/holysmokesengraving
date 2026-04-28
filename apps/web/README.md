# Holy Smokes Engraving — Web

Next.js 16 storefront for the HolysmokesEngraving e-commerce platform.

## Tech Stack

- **Next.js 16** (App Router) — SSG/SSR pages
- **React 19** — UI components
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Zustand v5** — cart state, persisted to localStorage
- **Storybook 10** — component development and docs

## Prerequisites

- Node.js 20 LTS or later
- npm 10+

## Getting Started

Install dependencies from the repo root:

```bash
cd apps/web
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script                    | Description                   |
| ------------------------- | ----------------------------- |
| `npm run dev`             | Start dev server on port 3000 |
| `npm run build`           | Production build              |
| `npm run start`           | Serve production build        |
| `npm run lint`            | Run ESLint                    |
| `npm run storybook`       | Start Storybook on port 6006  |
| `npm run build-storybook` | Build static Storybook        |
| `npm run test`            | Run Storybook component tests via Vitest |
| `npm run test:ui`         | Run test with Vitest UI       |

## Project Structure

```
src/
  app/          # Next.js App Router pages
  components/   # Shared UI components
  data/         # Static product data
  store/        # Zustand cart store
  types/        # TypeScript types
  utils/        # formatMoney, analytics stubs
  stories/      # Storybook stories and component tests
```

## Key Pages

| Route               | Description                               |
| ------------------- | ----------------------------------------- |
| `/`                 | Home / hero                               |
| `/shop`             | Product listing with search and filters   |
| `/shop/[slug]`      | Product detail page                       |
| `/cart`             | Cart with quantity controls               |
| `/checkout`         | Checkout form (guest, placeholder Stripe) |
| `/checkout/success` | Order confirmation                        |
| `/login`            | Login skeleton                            |
| `/register`         | Register skeleton                         |
