# Nightly database backups

Every night at 03:00 UTC (~13:00 AEST) a GitHub Action dumps the Supabase
database, encrypts it with AES-256, and commits the encrypted file to a
private backup repo. This survives Supabase project deletion, this repo
being pulled, and Vercel enforcement — as long as the backup repo and the
passphrase both exist somewhere, you can rebuild.

The workflow lives at [.github/workflows/backup-database.yml](.github/workflows/backup-database.yml).
The restore helper is [scripts/restore-backup.sh](scripts/restore-backup.sh).

---

## One-time setup

Do these steps in order. Takes ~15 minutes.

### 1. Create the backup repo

- GitHub → **New repository**
- Name: `vape-store-backups` (or anything — you'll paste the full path in step 4)
- **Private** ← must not be public
- Empty (no README, no gitignore)

### 2. Create a deploy key with **write** access

On your local machine:

```bash
ssh-keygen -t ed25519 -C "vape-store backup bot" -f ~/.ssh/vape-backup -N ""
# → produces ~/.ssh/vape-backup (private) and ~/.ssh/vape-backup.pub
```

In the backup repo:

- **Settings → Deploy keys → Add deploy key**
- Title: `nightly-backup-write`
- Key: paste the contents of `~/.ssh/vape-backup.pub`
- **Allow write access** ← must be checked
- Save

### 3. Generate a backup encryption passphrase

```bash
openssl rand -base64 48
```

Save the output in your password manager (1Password / Bitwarden / etc.) under
"Vape Store — Backup Passphrase". **This is the only way to decrypt backups.
Lose it → backups are useless.** Copy it exactly, no leading/trailing whitespace.

### 4. Grab the direct DB URL from Supabase

- Supabase dashboard → **Project Settings → Database → Connection string**
- Choose the **URI** tab, **Session mode** (port `5432`), **Show password**
- Copy the full string, looks like:
  `postgres://postgres.<projectref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres`

### 5. Add all four secrets to the `vape-store` repo

On GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `SUPABASE_DB_URL` | The connection string from step 4 |
| `BACKUP_ENCRYPTION_PASSPHRASE` | The passphrase from step 3 |
| `BACKUP_REPO` | e.g. `sydneymarketonline8-code/vape-store-backups` (owner/name) |
| `BACKUP_REPO_SSH_KEY` | Contents of `~/.ssh/vape-backup` (the **private** file, whole thing including `-----BEGIN...` / `-----END...` lines) |

### 6. Verify

- Actions tab → **Nightly Supabase backup** → **Run workflow → Run**
- Watch it. Successful run = a new `.gpg` file appears in the backup repo
  under `YYYY-MM/vapestore-<timestamp>.sql.gpg`.
- The step summary shows the destination path.

If it fails, check the error message in the failed step — most common
causes are a wrong password in `SUPABASE_DB_URL`, missing "Allow write
access" on the deploy key, or a passphrase copied with a trailing newline.

Delete your local copy of `~/.ssh/vape-backup*` once the secrets are saved —
GitHub has them now, keeping them locally just increases blast radius.

---

## Restoring

You'll do this if:
- The primary Supabase project is deleted or corrupted
- You want to spin up a staging copy of production for testing
- You need to inspect data from a specific point in time

### Steps

1. **Create the target Supabase project** — usually a fresh one, so no
   conflicts. Copy its **direct Session-mode connection string** (same
   format as `SUPABASE_DB_URL` above).

2. **Clone the backup repo locally** — or just download the one file you
   need from the GitHub UI.

3. **Restore:**

   ```bash
   # From this repo's root
   chmod +x scripts/restore-backup.sh
   scripts/restore-backup.sh \
     ~/Downloads/vapestore-2026-07-03_030012.sql.gpg \
     "postgres://postgres.<newref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres"
   ```

   The script will:
   - Prompt for the encryption passphrase (saved in step 3 of setup)
   - Confirm before writing to the target
   - Decrypt into a temp file (shredded on exit)
   - Apply via `psql --single-transaction` (all or nothing)

4. **Update env vars** — point the app at the new Supabase project by
   changing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   and `SUPABASE_SERVICE_ROLE_KEY` on Vercel + `.env.local`.

5. **Redeploy** on Vercel.

Total recovery time from a fresh Supabase project: **~15 minutes.**

---

## Retention

The workflow keeps everything — daily backups are tiny (< 1 MB per night
for a catalog + customer table this size), so keeping a year of history
costs less than 400 MB. No pruning cron needed.

If it ever gets huge, add a monthly retention job that keeps: last 30 days
daily + last 12 months monthly + older annual snapshots.

---

## What's NOT backed up

- **Auth users** (`auth.users` table) — Supabase manages this schema
  separately and `pg_dump` on the pooler can't touch it. If Supabase is
  totally lost, customers have to re-sign-up. Their orders/data are all
  in `public.*` and DO get backed up.
- **Storage bucket files** — product images uploaded to Supabase Storage.
  These live in a separate object store, not the Postgres database. If
  they're important, add a nightly `rclone` of the bucket to R2/S3 (say
  the word and I'll wire it).
- **Environment variables** — nothing sensitive stored in the DB. Env vars
  live in Vercel / `.env.local` only. Export those separately if needed.

---

## Cost

Zero. GitHub Actions Free includes 2000 minutes/month. This job takes ~1
minute. Backup repo is private (free). No cloud storage bills.
