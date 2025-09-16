#!/usr/bin/env bash
set -Eeuo pipefail

# ---- Config (override via env or flags) ----
COMPOSE_FILE="${COMPOSE_FILE:-infra/local/docker-compose.yml}"
GATEWAY_SERVICE="${GATEWAY_SERVICE:-gateway}"
PRICE_SERVICE="${PRICE_SERVICE:-price-svc}"
GATEWAY_URL="${GATEWAY_URL:-http://localhost:4000}"
PLAYER_ID="${PLAYER_ID:-ETH}"
DUMP_DIR="${DUMP_DIR:-artifacts}"
TEARDOWN="${TEARDOWN:-false}"
REBUILD="${REBUILD:-false}"

usage() {
  cat <<EOF
Usage: $0 [--rebuild] [--down] [--compose <file>] [--gateway-url <url>] [--player-id <id>]

Defaults:
  --compose         $COMPOSE_FILE
  --gateway-url     $GATEWAY_URL
  --player-id       $PLAYER_ID

Environment overrides also supported:
  COMPOSE_FILE, GATEWAY_SERVICE, PRICE_SERVICE, GATEWAY_URL, PLAYER_ID, DUMP_DIR,
  TEARDOWN=true|false, REBUILD=true|false
EOF
}

# ---- Args ----
while [[ $# -gt 0 ]]; do
  case "$1" in
    --down) TEARDOWN=true ;;
    --rebuild) REBUILD=true ;;
    --compose|-f) COMPOSE_FILE="$2"; shift ;;
    --gateway-url) GATEWAY_URL="$2"; shift ;;
    --player-id) PLAYER_ID="$2"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 2 ;;
  esac
  shift
done

# ---- Pre-flight ----
command -v jq >/dev/null || { echo "jq is required (brew install jq)."; exit 1; }
command -v docker >/dev/null || { echo "docker is required."; exit 1; }
mkdir -p "$DUMP_DIR"

ts() { date +%Y%m%dT%H%M%S; }

on_error() {
  local stamp; stamp="$(ts)"
  echo "Collecting logs to $DUMP_DIR/${stamp}-*.log"
  docker compose -f "$COMPOSE_FILE" logs "$GATEWAY_SERVICE" > "$DUMP_DIR/${stamp}-${GATEWAY_SERVICE}.log" 2>&1 || true
  docker compose -f "$COMPOSE_FILE" logs "$PRICE_SERVICE"  > "$DUMP_DIR/${stamp}-${PRICE_SERVICE}.log" 2>&1 || true
  echo "❌ Integration FAILED. See $DUMP_DIR/${stamp}-*.log and $DUMP_DIR/last-quote.json (if any)."
}
trap on_error ERR

# ---- Bring up minimal stack ----
if [[ "$REBUILD" == "true" ]]; then
  docker compose -f "$COMPOSE_FILE" build "$GATEWAY_SERVICE"
fi
docker compose -f "$COMPOSE_FILE" up -d "$GATEWAY_SERVICE" "$PRICE_SERVICE"

# ---- Wait for health ----
wait_for() {
  local url="$1" name="$2" tries="${3:-60}" delay="${4:-1}"
  for ((i=1;i<=tries;i++)); do
    if out="$(curl -fsS "$url" 2>/dev/null)"; then
      echo "[$name] healthy: $out"
      return 0
    fi
    sleep "$delay"
  done
  echo "[$name] not healthy after $tries attempts"
  return 1
}

wait_for "${GATEWAY_URL}/healthz" "$GATEWAY_SERVICE"

# ---- Call /api/quote and assert schema ----
QUOTE_JSON="$(curl -fsS "${GATEWAY_URL}/api/quote?playerId=${PLAYER_ID}")"
echo "$QUOTE_JSON" > "$DUMP_DIR/last-quote.json"

# Keys present
jq -e 'has("playerId") and has("bid") and has("ask") and has("mid") and has("tsMs") and has("reqId")' \
  <<<"$QUOTE_JSON" >/dev/null

# Types correct and reqId non-empty
jq -e '
  (.playerId|type=="string") and
  (.bid|type=="number") and
  (.ask|type=="number") and
  (.mid|type=="number") and
  (.tsMs|type=="number") and
  (.reqId|type=="string" and (.|length>0))
' <<<"$QUOTE_JSON" >/dev/null

echo "✅ Integration assertions passed for /api/quote (${GATEWAY_URL})."

# ---- Optional teardown ----
if [[ "$TEARDOWN" == "true" ]]; then
  docker compose -f "$COMPOSE_FILE" down
fi

echo "✅ Integration script completed successfully."
