#!/usr/bin/env bash
set -euo pipefail

: "${GATEWAY_PORT:=4000}"
: "${PRICE_SVC_PORT:=18000}"
: "${ENGINE_PORT:=17000}"
: "${LEDGER_PORT:=16000}"

check_one() {
  local port="$1"
  local -a paths=("/readyz" "/healthz" "/health" "/metrics" "/")
  for i in {1..60}; do
    for p in "${paths[@]}"; do
      code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}${p}" || true)
      if [[ "$code" =~ ^[234][0-9][0-9]$ ]]; then
        echo "port ${port} ${p} -> ${code} OK"; return 0
      fi
    done
    sleep 1
  done
  echo "port ${port} not ready (tried ${paths[*]})"; return 1
}

ok=0

# hard requirements
check_one "$GATEWAY_PORT" || ok=1
curl -sSf "${NATS_MONITOR_URL:-http://127.0.0.1:8222}/varz" >/dev/null && echo "nats monitor OK" || { echo "nats monitor NOT OK"; ok=1; }

# soft checks (do not fail build yet)
check_one "$PRICE_SVC_PORT" || true
check_one "$ENGINE_PORT"    || true
check_one "$LEDGER_PORT"    || true

exit "$ok"
