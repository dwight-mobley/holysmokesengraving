# Holy Smokes Engraving API

Express + Prisma API backed by a [Supabase](https://supabase.com) hosted Postgres database.

## Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) — `npx install -g supabase` or `winget install Supabase.CLI`

## Environment Setup

Create `apps/api/.env`:

```env
DATABASE_URL=<your-supabase-connection-string>
ADMIN_API_KEY=<random-secret-key>