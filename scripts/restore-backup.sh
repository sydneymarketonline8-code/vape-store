#!/usr/bin/env bash
# Restore a nightly Supabase backup produced by
# .github/workflows/backup-database.yml.
#
# Usage:
#   scripts/restore-backup.sh <encrypted-dump.sql.gpg> <target-postgres-url>
#
# Example (recovering into a fresh Supabase project):
#   scripts/restore-backup.sh \
#     vapestore-2026-07-03_030012.sql.gpg \
#     "postgres://postgres.newprojectref:PASSWORD@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
#
# The script asks for the BACKUP_ENCRYPTION_PASSPHRASE interactively so it
# never appears in shell history.
#
# Requires: gpg, psql (postgresql-client) installed locally.

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <encrypted-dump.sql.gpg> <target-postgres-url>"
  echo
  echo "Recover backup 2026-07-03 into a fresh Supabase project:"
  echo "  $0 vapestore-2026-07-03_030012.sql.gpg \\"
  echo "     'postgres://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:5432/postgres'"
  exit 1
fi

DUMP="$1"
TARGET="$2"

if [ ! -f "$DUMP" ]; then
  echo "error: dump file '$DUMP' not found" >&2
  exit 1
fi

for cmd in gpg psql; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "error: '$cmd' not on PATH — install postgresql-client and gnupg first" >&2
    exit 1
  fi
done

echo "This will REPLACE existing tables in the target database."
echo "Target: ${TARGET%%@*}@***"
read -r -p "Continue? [y/N] " ok
if [ "${ok,,}" != "y" ] && [ "${ok,,}" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

read -r -s -p "Backup passphrase: " PP
echo

PLAIN=$(mktemp -t vapestore-restore.XXXXXX.sql)
trap 'shred -u "$PLAIN" 2>/dev/null || rm -f "$PLAIN"' EXIT

printf '%s' "$PP" | gpg --batch --yes --passphrase-fd 0 --decrypt --output "$PLAIN" "$DUMP"

echo "Decrypted dump: $(wc -l < "$PLAIN") lines, $(stat -c %s "$PLAIN" 2>/dev/null || stat -f %z "$PLAIN") bytes"
echo "Applying to target…"

psql --set ON_ERROR_STOP=on --single-transaction "$TARGET" < "$PLAIN"

echo "Restore complete."
