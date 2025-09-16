#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
export COMPOSE="docker compose -f $ROOT/infra/local/docker-compose.yml -f $ROOT/infra/local/docker-compose.override.yml"


# Bring up
$COMPOSE up -d --build


# Wait health
"$ROOT/scripts/check_health.sh"


# Ensure JetStream streams/consumers
"$ROOT/scripts/nats_setup.sh" || true


# Run smoke
"$ROOT/scripts/smoke_quote.sh" 123


# Grab quick NATS stats
curl -sf "${NATS_MONITOR_URL:-http://localhost:8222}/varz" | jq '{in_msgs, out_msgs}' || true


# Success
echo "E2E OK"