#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
TEST_DIR="$(mktemp -d)"
trap 'rm -rf -- "$TEST_DIR"' EXIT
mkdir -p "$TEST_DIR/bin" "$TEST_DIR/backups"
export TEST_LOG="$TEST_DIR/events" MYSQL_DATABASE=import_fixture MYSQL_USER=fixture MYSQL_PWD=fixture
export TEST_TABLES=1 TEST_BACKUP_FAIL=0 TEST_IMPORT_FAIL=0
export PATH="$TEST_DIR/bin:$PATH"
printf 'CREATE TABLE `fixture` (`id` INT);\n' > "$TEST_DIR/input.sql"
cat > "$TEST_DIR/bin/mysql" <<'MOCK'
#!/usr/bin/env bash
set -eu
for arg in "$@"; do
    case "$arg" in
        *'SELECT COUNT('* ) echo "$TEST_TABLES"; exit 0 ;;
        *'SELECT CONCAT('* ) echo 'DROP TABLE IF EXISTS `old_fixture`;'; exit 0 ;;
    esac
done
input="$(cat)"
if [[ "$input" == *'DROP TABLE'* ]]; then
    echo drop >> "$TEST_LOG"
else
    echo import >> "$TEST_LOG"
    if [[ "$TEST_IMPORT_FAIL" == 1 ]]; then exit 1; fi
fi
MOCK
cat > "$TEST_DIR/bin/mysqldump" <<'MOCK'
#!/usr/bin/env bash
echo backup >> "$TEST_LOG"
if [[ "$TEST_BACKUP_FAIL" == 1 ]]; then exit 1; fi
printf 'CREATE TABLE `old_fixture` (`id` INT);\n'
MOCK
chmod +x "$TEST_DIR/bin/mysql" "$TEST_DIR/bin/mysqldump"
run() {
    bash "$ROOT/scripts/import-database.sh" --native --file "$TEST_DIR/input.sql" --backup-dir "$TEST_DIR/backups" "$@" > "$TEST_DIR/output" 2>&1
}
reset_test() { : > "$TEST_LOG"; export TEST_BACKUP_FAIL=0 TEST_IMPORT_FAIL=0 TEST_TABLES=1; }
fail() { cat "$TEST_DIR/output" >&2; echo "FAIL: $*" >&2; exit 1; }

reset_test
run --check || fail check
[[ ! -s "$TEST_LOG" ]] || fail 'check changed data'
run && fail 'nonempty target accepted without --replace'
[[ ! -s "$TEST_LOG" ]] || fail 'refusal changed data'

reset_test
export TEST_BACKUP_FAIL=1
run --replace && fail 'failed backup accepted'
[[ "$(cat "$TEST_LOG")" == backup ]] || fail 'tables changed after backup failure'
[[ -z "$(find "$TEST_DIR/backups" -name '*.sql' -print)" ]] || fail 'partial backup retained'

reset_test
run --replace || fail replace
[[ "$(cat "$TEST_LOG")" == $'backup\ndrop\nimport' ]] || fail 'incorrect backup/drop/import order'
backup="$(find "$TEST_DIR/backups" -name '*.sql' -print -quit)"
[[ -s "$backup" ]] || fail 'backup missing'

reset_test
export TEST_IMPORT_FAIL=1
run --replace && fail 'failed import accepted'
grep -q 'target may be partially imported' "$TEST_DIR/output" || fail 'missing recovery warning'
[[ -s "$backup" ]] || fail 'original backup lost'

reset_test
export TEST_TABLES=0
run || fail 'empty database import'
[[ "$(cat "$TEST_LOG")" == import ]] || fail 'empty target should import without dropping'

reset_test
printf 'USE `another_database`;\nCREATE TABLE `fixture` (`id` INT);\n' > "$TEST_DIR/input.sql"
run --replace && fail 'database switching accepted'
[[ ! -s "$TEST_LOG" ]] || fail 'invalid dump changed data'
echo 'PASS: validation, dry check, nonempty refusal, backup failure, replace order, recovery warning and empty-target import.'
