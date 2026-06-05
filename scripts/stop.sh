#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker compose -f "$ROOT/infra/nginx/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/front/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/ingestion-worker/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/api/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/infra/redis/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/infra/database/compose.yml" --project-directory "$ROOT" down

echo "All services stopped."
