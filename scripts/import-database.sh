#!/usr/bin/env bash
# Import a trusted phpMyAdmin/MySQL export without exposing an HTTP endpoint.
set -Eeuo pipefail
umask 077

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT/data/harry_db.sql"
BACKUP_DIR="$ROOT/storage/app/private/backups"
MODE=docker
SERVICE=db
REPLACE=0
CHECK=0
BACKUP_FILE=''

usage() {
    cat <<'HELP'
Usage: bash scripts/import-database.sh [options]
  --file PATH       SQL export (default: data/harry_db.sql)
  --replace         Back up, then replace ALL tables/views in the target database
  --check           Validate file, connection and destination; do not import
  --native          Use installed MySQL 8 mysql/mysqldump clients instead of Docker
  --service NAME    Docker Compose database service (default: db)
  --backup-dir DIR  Private backup directory (default: storage/app/private/backups)
  --help            Show this help

Docker mode reads credentials from the database container environment.
Native mode requires MYSQL_DATABASE, MYSQL_USER and MYSQL_PWD; optional
MYSQL_HOST (127.0.0.1), MYSQL_TCP_PORT (3306), MYSQL_UNIX_PORT, MYSQL_SSL_CA.
Run during a maintenance window with web traffic and queue workers stopped.
HELP
}

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
while (($#)); do
    case "$1" in
        --file|--service|--backup-dir)
            (($# >= 2)) || die "Missing value for $1"
            case "$1" in
                --file) SQL_FILE="$2" ;;
                --service) SERVICE="$2" ;;
                --backup-dir) BACKUP_DIR="$2" ;;
            esac
            shift 2 ;;
        --native) MODE=native; shift ;;
        --replace) REPLACE=1; shift ;;
        --check) CHECK=1; shift ;;
        --help|-h) usage; exit 0 ;;
        *) die "Unknown option: $1" ;;
    esac
done

[[ -r "$SQL_FILE" && -s "$SQL_FILE" ]] || die "SQL file missing, empty or unreadable: $SQL_FILE"
# This importer targets one configured database. Do not allow a dump to switch it.
if LC_ALL=C grep -Eiq '^[[:space:]]*(USE[[:space:]]|CREATE[[:space:]]+DATABASE[[:space:]]|DROP[[:space:]]+DATABASE[[:space:]])' "$SQL_FILE"; then
    die 'Remove USE / CREATE DATABASE / DROP DATABASE statements from the export first.'
fi
LC_ALL=C grep -Eiq '^[[:space:]]*CREATE[[:space:]]+TABLE[[:space:]]' "$SQL_FILE" || die 'Expected a full SQL export containing CREATE TABLE statements.'

if [[ "$MODE" == docker ]]; then
    command -v docker >/dev/null || die 'Docker is unavailable. Use --native for a server without Docker.'
    cd "$ROOT"
    COMPOSE=(docker compose exec -T "$SERVICE")
    TARGET_DB="$("${COMPOSE[@]}" printenv MYSQL_DATABASE)"
    # Password stays in the container environment; it is never placed in argv.
    client() {
        "${COMPOSE[@]}" sh -c 'export MYSQL_PWD="${MYSQL_PASSWORD:?MYSQL_PASSWORD is required}"; tool="$1"; shift; exec "$tool" --user="${MYSQL_USER:?MYSQL_USER is required}" "$@"' sh "$@"
    }
else
    command -v mysql >/dev/null || die 'Install the MySQL 8 client (mysql).'
    command -v mysqldump >/dev/null || die 'Install the MySQL 8 client (mysqldump).'
    : "${MYSQL_DATABASE:?Export MYSQL_DATABASE first}"
    : "${MYSQL_USER:?Export MYSQL_USER first}"
    : "${MYSQL_PWD?Export MYSQL_PWD first}"
    export MYSQL_PWD
    TARGET_DB="$MYSQL_DATABASE"
    CONNECTION=("--user=$MYSQL_USER")
    if [[ -n "${MYSQL_UNIX_PORT:-}" ]]; then
        CONNECTION+=("--socket=$MYSQL_UNIX_PORT")
    else
        CONNECTION+=(--protocol=TCP "--host=${MYSQL_HOST:-127.0.0.1}" "--port=${MYSQL_TCP_PORT:-3306}")
    fi
    if [[ -n "${MYSQL_SSL_CA:-}" ]]; then
        CONNECTION+=(--ssl-mode=VERIFY_IDENTITY "--ssl-ca=$MYSQL_SSL_CA")
    fi
    client() { local tool="$1"; shift; "$tool" "${CONNECTION[@]}" "$@"; }
fi
[[ "$TARGET_DB" =~ ^[a-zA-Z0-9_-]+$ ]] || die 'Database name must contain only letters, numbers, underscores or hyphens.'
MYSQL_ARGS=(--default-character-set=utf8mb4 --binary-mode=1 --max-allowed-packet=256M "--database=$TARGET_DB")
TABLE_COUNT="$(client mysql "${MYSQL_ARGS[@]}" --batch --skip-column-names --execute="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()")"
[[ "$TABLE_COUNT" =~ ^[0-9]+$ ]] || die 'Could not read the destination table count.'
printf 'SQL: %s\nTarget: %s (%s mode)\nExisting tables/views: %s\n' "$SQL_FILE" "$TARGET_DB" "$MODE" "$TABLE_COUNT"
if ((CHECK)); then
    printf 'Check complete. No data changed.\n'
    if ((TABLE_COUNT > 0)); then printf 'Import requires --replace because the destination is not empty.\n'; fi
    exit 0
fi
if ((TABLE_COUNT > 0 && !REPLACE)); then
    die 'Destination is not empty. Use --replace only when you intend to replace all its tables/views.'
fi

DROP_FILE=''
cleanup() { if [[ -n "$DROP_FILE" ]]; then rm -f -- "$DROP_FILE"; fi; }
on_error() {
    printf 'Import stopped. MySQL DDL is not transactional; the target may be partially imported.\n' >&2
    if [[ -n "$BACKUP_FILE" ]]; then printf 'Backup: %s\nKeep maintenance enabled until the database is recovered.\n' "$BACKUP_FILE" >&2; fi
}
trap cleanup EXIT
trap on_error ERR

if ((TABLE_COUNT > 0)); then
    mkdir -p -- "$BACKUP_DIR"
    BACKUP_FILE="$(mktemp "$BACKUP_DIR/${TARGET_DB}-before-import-$(date +%Y%m%d-%H%M%S)-XXXXXX.sql")"
    printf 'Creating backup: %s\n' "$BACKUP_FILE"
    if ! client mysqldump --single-transaction --quick --hex-blob --routines --events --triggers --no-tablespaces --set-gtid-purged=OFF --default-character-set=utf8mb4 "$TARGET_DB" > "$BACKUP_FILE"; then
        rm -f -- "$BACKUP_FILE"
        BACKUP_FILE=''
        die 'Backup failed. No tables were removed.'
    fi
    [[ -s "$BACKUP_FILE" ]] || die 'Backup is empty. No tables were removed.'
    DROP_FILE="$(mktemp "$BACKUP_DIR/import-drop-XXXXXX.sql")"
    printf 'SET FOREIGN_KEY_CHECKS=0;\n' > "$DROP_FILE"
    client mysql "${MYSQL_ARGS[@]}" --batch --skip-column-names --execute="SELECT CONCAT('DROP ', IF(TABLE_TYPE = 'VIEW', 'VIEW', 'TABLE'), ' IF EXISTS \`', REPLACE(TABLE_NAME, '\`', '\`\`'), '\`;') FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY TABLE_TYPE DESC" >> "$DROP_FILE"
    printf 'SET FOREIGN_KEY_CHECKS=1;\n' >> "$DROP_FILE"
    client mysql "${MYSQL_ARGS[@]}" < "$DROP_FILE"
fi

printf 'Importing SQL...\n'
client mysql "${MYSQL_ARGS[@]}" < "$SQL_FILE"
printf 'Import complete.\n'
if [[ -n "$BACKUP_FILE" ]]; then printf 'Previous database backup: %s\n' "$BACKUP_FILE"; fi
printf 'Next: run php artisan migrate --force, then refresh application caches before reopening traffic.\n'
