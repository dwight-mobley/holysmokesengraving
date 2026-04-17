# Holy Smokes Engraving — Copilot Instructions

## Project
E-commerce platform for a laser engraving business.
PERN stack: Postgres, Express, React (Next.js), Node — all TypeScript.
Payments via Stripe. Emails via SparkPost. Deployed with Docker + Vercel.

## Current Progress
- Week 1 complete: repo, tooling, ESLint (flat config v9), Prettier, Husky + lint-staged, tsconfig (strict), 3 utility functions with Jest tests, CI workflow
- Currently on: Week 2

## Tech Decisions Made
- ESLint v9 flat config (eslint.config.js)
- lint-staged uses .lintstagedrc.js with function form (Windows path fix)
- tsconfig types: ["node", "jest"]
- Jest + ts-jest for testing

## Conventions
- Utility functions in src/utils/
- Tests in src/utils/__tests__/
- Strict TypeScript everywhere
- Commit messages: Conventional Commits format — `<type>(<scope>): <description>`
  - Types: feat, fix, chore, refactor, test, docs, ci, style
  - Examples: `feat(schemas): add product validation`, `test(utils): add edge case tests`
- Branch naming: `feature/<short-description>`, `fix/<short-description>`
  - Examples: `feature/product-schemas`, `fix/validation-error-handling`

## Reference
See ROADMAP.md for the full 90-day plan.