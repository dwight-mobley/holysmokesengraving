# Holysmokes Engraving 90 Day Roadmap


#### Week 1
1. **Step 1** — Create repo holysmokesengraving and clone locally — **infra** — **High**
2. **Step 2** — Add .gitignore — **infra** — **Medium**
3. **Step 3** — Add .env.example — **infra** — **Medium**
4. **Step 4** — Add initial README.md — **docs** — **Medium**
5. **Step 5** — Create docs/day1-notes.md and write Day 1 journal entry — **docs** — **Low**
6. **Step 6** — Install Node.js LTS — **infra** — **Low**
7. **Step 7** — Install VS Code and extensions TypeScript ESLint Prettier — **devtools** — **Low**
8. **Step 8** — Configure ESLint and Prettier — **devtools** — **Medium**
9. **Step 9** — Enable strict TypeScript settings tsconfig strict — **backend** — **High**
10. **Step 10** — Add Husky pre-commit hook and lint script — **devtools** — **Medium**
11. **Step 11** — Write 3 TypeScript utility functions slug money ID generator — **backend** — **Medium**
12. **Step 12** — Add Jest and ts-jest and write unit tests for utilities — **testing** — **High**
13. **Step 13** — Create CI skeleton ci.yml to run lint and tests — **ci** — **High**
14. **Step 14** — Push first commit — **infra** — **High**


#### Week 2
1. **Step 1** — Practice generics utility types mapped types and document learnings — **backend** — **Medium**
2. **Step 2** — Convert 3 JS snippets to TypeScript — **backend** — **Medium**
3. **Step 3** — Create custom React hook with strong typing — **frontend** — **Medium**
4. **Step 4** — Add Zod or Yup for schema validation — **backend** — **Medium**
5. **Step 5** — Create API DTO types — **backend** — **Medium**
6. **Step 6** — Document TS learnings in docs/ts-notes.md — **docs** — **Low**
7. **Step 7** — Add more unit tests for utilities — **testing** — **Medium**
8. **Step 8** — Update CI to run tests and lint — **ci** — **High**
9. **Step 9** — Write Week 2 journal entry — **docs** — **Low**

#### Week 3
1. **Step 1** — Scaffold Next.js + TypeScript app apps/web — **frontend** — **High**
2. **Step 2** — Install Tailwind CSS and set up design tokens — **frontend** — **Medium**
3. **Step 3** — Create base layout navigation global styles — **frontend** — **Medium**
4. **Step 4** — Install Storybook and add initial stories — **frontend** — **Medium**
5. **Step 5** — Build core components Button Card Input Navbar Footer ProductCard — **frontend** — **High**
6. **Step 6** — Build product listing page static data — **frontend** — **Medium**
7. **Step 7** — Build product detail page static data — **frontend** — **Medium**
8. **Step 8** — Add SEO meta tags — **frontend** — **Low**
9. **Step 9** — Add cart state Zustand or Context — **frontend** — **Medium**
10. **Step 10** — Persist cart to localStorage — **frontend** — **Low**
11. **Step 11** — Add accessibility checks — **frontend** — **Medium**
12. **Step 12** — Add Lighthouse performance checks — **frontend** — **Medium**
13. **Step 13** — Write component tests — **testing** — **Medium**
14. **Step 14** — Deploy preview to Vercel — **deploy** — **Medium**
15. **Step 15** — Write Week 3 journal entry — **docs** — **Low**

#### Week 4
1. **Step 1** — Integrate Cloudinary or S3 for images — **frontend** — **Medium**
2. **Step 2** — Add product filters and search — **frontend** — **Medium**
3. **Step 3** — Improve responsive design — **frontend** — **Medium**
4. **Step 4** — Add analytics event stubs — **frontend** — **Low**
5. **Step 5** — Add checkout UI placeholder API — **frontend** — **High**
6. **Step 6** — Add login/register skeleton optional — **frontend** — **Low**
7. **Step 7** — Add Storybook docs — **frontend** — **Low**
8. **Step 8** — Update README with frontend setup — **docs** — **Low**
9. **Step 9** — Write Week 4 journal entry — **docs** — **Low**

#### Week 5
1. **Step 1** — Implement SSG SSR ISR patterns where appropriate — **frontend** — **Medium**
2. **Step 2** — Add React Hook Form and Zod validation — **frontend** — **Medium**
3. **Step 3** — Add integration tests for cart and product pages — **testing** — **High**
4. **Step 4** — Create component library README — **docs** — **Low**
5. **Step 5** — Define API contracts for backend OpenAPI sketch — **backend** — **Medium**
6. **Step 6** — Record 3-minute frontend walkthrough — **docs** — **Low**
7. **Step 7** — Write Week 5 journal entry — **docs** — **Low**

#### Week 6
1. **Step 1** — Scaffold Express + TypeScript API apps/api — **backend** — **High**
2. **Step 2** — Install Prisma or TypeORM — **backend** — **Medium**
3. **Step 3** — Dockerize Postgres — **infra** — **High**
4. **Step 4** — Create DB schema products variants customers orders — **backend** — **High**
5. **Step 5** — Create seed script — **backend** — **Medium**
6. **Step 6** — Add DB migrations — **infra** — **Medium**
7. **Step 7** — Implement GET /products — **backend** — **Medium**
8. **Step 8** — Implement GET /products/:slug — **backend** — **Medium**
9. **Step 9** — Implement POST /orders no payment yet — **backend** — **High**
10. **Step 10** — Add validation middleware — **backend** — **Medium**
11. **Step 11** — Add error handling middleware — **backend** — **Medium**
12. **Step 12** — Write integration tests — **testing** — **High**
13. **Step 13** — Deploy API to staging — **deploy** — **Medium**
14. **Step 14** — Write Week 6 journal entry — **docs** — **Low**

#### Week 7
1. **Step 1** — Implement customer endpoints create get — **backend** — **Medium**
2. **Step 2** — Add inventory decrement logic — **backend** — **High**
3. **Step 3** — Add admin endpoints CRUD for products and orders — **backend** — **High**
4. **Step 4** — Add DB backup script — **infra** — **Low**
5. **Step 5** — Add structured logging — **infra** — **Medium**
6. **Step 6** — Document schema in docs/schema.md — **docs** — **Low**
7. **Step 7** — Write Week 7 journal entry — **docs** — **Low**

#### Week 8
1. **Step 1** — Configure Stripe products and prices — **payments** — **High**
2. **Step 2** — Implement Checkout session endpoint — **payments** — **High**
3. **Step 3** — Implement webhook handler with signature verification — **payments** — **High**
4. **Step 4** — Add idempotency keys and retry logic — **payments** — **High**
5. **Step 5** — Test with Stripe CLI — **payments** — **Medium**
6. **Step 6** — Run full checkout webhook DB flow via tunnel — **payments** — **High**
7. **Step 7** — Write Week 8 journal entry — **docs** — **Low**

#### Week 9
1. **Step 1** — Create SparkPost templates for order confirmation and admin alerts — **email** — **Medium**
2. **Step 2** — Implement email service module — **backend** — **Medium**
3. **Step 3** — Send order confirmation email — **email** — **Medium**
4. **Step 4** — Send admin alert email — **email** — **Low**
5. **Step 5** — Log email events in DB — **backend** — **Low**
6. **Step 6** — Test deliverability — **email** — **Low**
7. **Step 7** — Add screenshots to case study — **docs** — **Low**
8. **Step 8** — Write Week 9 journal entry — **docs** — **Low**

#### Week 10
1. **Step 1** — Write Dockerfiles for API and web — **infra** — **Medium**
2. **Step 2** — Write docker-compose.yml — **infra** — **Medium**
3. **Step 3** — Add health checks — **infra** — **Medium**
4. **Step 4** — Add seed-on-startup script — **infra** — **Low**
5. **Step 5** — Configure Cloudflare Tunnel or ngrok for webhooks — **infra** — **Medium**
6. **Step 6** — Test webhook flow via tunnel — **infra** — **Medium**
7. **Step 7** — Document local dev workflow in docs/local-dev.md — **docs** — **Low**
8. **Step 8** — Write Week 10 journal entry — **docs** — **Low**

#### Week 11
1. **Step 1** — Finalize GitHub Actions CI and deploy workflows — **ci** — **High**
2. **Step 2** — Automate DB migrations in CI/CD — **ci** — **Medium**
3. **Step 3** — Add Lighthouse CI — **ci** — **Low**
4. **Step 4** — Add E2E tests Playwright or Cypress covering checkout and webhooks — **testing** — **High**
5. **Step 5** — Integrate Sentry or similar for error monitoring — **infra** — **Medium**
6. **Step 6** — Deploy staging and run smoke tests — **deploy** — **Medium**
7. **Step 7** — Write Week 11 journal entry — **docs** — **Low**

#### Week 12
1. **Step 1** — Build portfolio homepage — **docs** — **Medium**
2. **Step 2** — Add HolysmokesEngraving case study with screenshots and demo video — **docs** — **High**
3. **Step 3** — Write resume bullets tied to project outcomes — **career** — **Medium**
4. **Step 4** — Prepare STAR stories — **career** — **Low**
5. **Step 5** — Create job tracker — **career** — **Low**
6. **Step 6** — Apply to 10-20 roles — **career** — **Medium**
7. **Step 7** — Publish portfolio — **career** — **Medium**
8. **Step 8** — Update LinkedIn — **career** — **Low**
9. **Step 9** — Write Week 12 journal entry — **docs** — **Low**

#### Anytime Backlog
1. **Step 1** — Refactor something messy — **techdebt** — **Low**
2. **Step 2** — Improve test coverage — **testing** — **Medium**
3. **Step 3** — Add a new admin feature — **backend** — **Medium**
4. **Step 4** — Write a blog post — **docs** — **Low**
5. **Step 5** — Record a demo video — **docs** — **Low**
6. **Step 6** — Improve Lighthouse score — **frontend** — **Medium**
7. **Step 7** — Add monitoring dashboards — **infra** — **Medium**

---

### Notes
- If you want this as a downloadable `.md` file, copy the contents above into a file named