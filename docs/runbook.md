# Runbook — HolySmokesengraving API

Operational procedures for deployments, database migrations, and rollbacks.

---

## Pre-Deploy Checklist

Before deploying any commit that includes a **new Prisma migration**, run a manual backup.

```powershell
# From the repo root
npm run db:backup --workspace=apps/api
```

This creates a timestamped file in `backups/`, e.g. `backups/postgres_20260515_143000.sql`.

**When is a backup required?**

| Migration type                          | Backup required? |
| --------------------------------------- | ---------------- |
| Add a column (nullable or with default) | No               |
| Add a new table                         | No               |
| Drop a column or table                  | **Yes**          |
| Rename a column or table                | **Yes**          |
| Change a column type                    | **Yes**          |

If you're unsure, check `apps/api/prisma/migrations/<latest>/migration.sql` before deploying.

---

## How Migrations Run in Production

Migrations are applied automatically via the **Render pre-deploy command** before the new API instance starts taking traffic:

```
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
```

This is configured in the Render dashboard under **Settings → Pre-deploy Command**. If the migration fails, Render aborts the deploy and keeps the current instance running.

---

## Rollback Procedure

Use this if a deploy causes errors and you need to revert both the code and the database.

### Step 1 — Identify the backup to restore

```powershell
ls backups/
# Pick the file timestamped just before the failed deploy
# e.g. backups/postgres_20260515_143000.sql
```

### Step 2 — Restore the database

```bash
psql $DATABASE_URL < backups/postgres_YYYYMMDD_HHMMSS.sql
```

Replace `$DATABASE_URL` with your production connection string from the Render environment variables, or set it in your shell first:

```bash
export DATABASE_URL="postgresql://..."
psql $DATABASE_URL < backups/postgres_20260515_143000.sql
```

### Step 3 — Redeploy the previous API version

1. Go to the Render dashboard → **HolySmokesengraving API** service
2. Click the **Deploys** tab
3. Find the last successful deploy before the bad one
4. Click **⋯ → Redeploy**

Render will run the pre-deploy command against the now-restored schema, which should be a no-op since those migrations are already applied.

---

## CI Migration Validation

Every push to `main` or `dev` runs `prisma migrate deploy` against a throwaway Postgres container in GitHub Actions (`test-api` job). If a migration is broken, the CI job fails before it can reach production.

See `.github/workflows/ci.yml` for the full configuration.

---

## Backup File Location

Backups are stored in `backups/` at the repo root and are excluded from Git (`.gitignore`). They are local only — not pushed to any remote. For production data safety, also verify that Render's managed Postgres has **automatic backups enabled** in the Render dashboard.
