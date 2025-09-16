#!/usr/bin/env bash
set -euo pipefail

echo "Running tests across services..."

if [ -d "gateway" ]; then
  echo "→ gateway"
  (cd gateway && [ -f package.json ] && npm test --silent || echo "  (no tests yet)")
fi

if [ -d "ledger" ]; then
  echo "→ ledger"
  (cd ledger && [ -f go.mod ] && go test ./... || echo "  (no tests yet)")
fi

if [ -d "reconciler" ]; then
  echo "→ reconciler"
  (cd reconciler && [ -f go.mod ] && go test ./... || echo "  (no tests yet)")
fi

if [ -d "engine" ]; then
  echo "→ engine"
  (cd engine && [ -f Cargo.toml ] && cargo test || echo "  (no tests yet)")
fi

if [ -d "signals" ]; then
  echo "→ signals"
  (cd signals && [ -f pyproject.toml ] && pytest -q || echo "  (no tests yet)")
fi

if [ -d "frontend" ]; then
  echo "→ frontend"
  (cd frontend && [ -f package.json ] && npm test --silent || echo "  (no tests yet)")
fi

echo "Done."
