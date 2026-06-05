#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Creating network..."
docker network create app-network 2>/dev/null || true

echo "Starting database..."
docker compose -f "$ROOT/infra/database/compose.yml" --project-directory "$ROOT" up -d

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
docker compose -f "$ROOT/infra/redis/compose.yml" --project-directory "$ROOT" up -d

echo ""
echo "Infra is ready. Services available at:"
echo "  Postgres : localhost:5432"
echo "  Redis    : localhost:6379"
echo "  pgAdmin  : http://localhost:5433"
echo ""
echo "Run your dev servers:"
echo "  cd apps/api && npm run start:dev"
echo "  cd apps/ingestion-worker && npm run start:dev"
echo "  cd apps/front && npm run dev"
