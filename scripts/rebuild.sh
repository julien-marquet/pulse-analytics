#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Rebuilding api..."
docker compose -f "$ROOT/apps/api/infra/compose.yml" --project-directory "$ROOT" build

echo "Rebuilding ingestion-worker..."
docker compose -f "$ROOT/apps/ingestion-worker/infra/compose.yml" --project-directory "$ROOT" build

echo "Rebuilding front..."
docker compose -f "$ROOT/apps/front/infra/compose.yml" --project-directory "$ROOT" build

echo "All images rebuilt."
