#!/usr/bin/env bash
set -euo pipefail
COMPOSE="docker compose -f infra/local/docker-compose.yml -f infra/local/docker-compose.override.yml"
$COMPOSE logs -f gateway engine price-svc ledger
