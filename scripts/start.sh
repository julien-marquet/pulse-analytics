#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BUILD_FLAG=""
if [[ "$1" == "--build" || "$1" == "-b" ]]; then
  BUILD_FLAG="--build"
fi

echo "Creating network..."
docker network create app-network 2>/dev/null || true

echo "Starting database..."
docker compose -f "$ROOT/infra/database/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "Waiting for postgres to be ready..."
until docker exec postgres pg_isready -q; do sleep 1; done

echo "Running migrations..."
docker build -f "$ROOT/packages/database/Dockerfile.migrate" -t db-migrate "$ROOT/packages/database"
docker run --rm \
  --network app-network \
  --env-file "$ROOT/infra/database/.env" \
  -e DATABASE_URL="postgresql://$(grep ^POSTGRES_USER "$ROOT/infra/database/.env" | cut -d= -f2):$(grep ^POSTGRES_PASSWORD "$ROOT/infra/database/.env" | cut -d= -f2)@postgres:5432/$(grep ^POSTGRES_DB "$ROOT/infra/database/.env" | cut -d= -f2)" \
  db-migrate

echo "Starting redis..."
docker compose -f "$ROOT/infra/redis/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "Starting api..."
docker compose -f "$ROOT/apps/api/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/api/infra/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "Starting ingestion worker..."
docker compose -f "$ROOT/apps/ingestion-worker/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/ingestion-worker/infra/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "Starting front..."
docker compose -f "$ROOT/apps/front/infra/compose.yml" --project-directory "$ROOT" down
docker compose -f "$ROOT/apps/front/infra/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "Starting nginx..."
docker compose -f "$ROOT/infra/nginx/compose.yml" --project-directory "$ROOT" up -d $BUILD_FLAG

echo "All services started."
