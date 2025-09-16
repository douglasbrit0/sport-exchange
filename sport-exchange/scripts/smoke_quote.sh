#!/usr/bin/env bash
set -euo pipefail
: "${GATEWAY_PUBLIC_URL:=http://localhost:4000}"
: "${PRICE_SVC_URL:=http://localhost:18000}"
PLAYER_ID="${1:-123}"

try() {
  local url="$1"
  echo "-> GET $url"
  status=$(curl -s -o /tmp/smoke.out -w "%{http_code}" "$url" || true)
  echo "   status=$status"
  if [[ "$status" == "200" ]]; then cat /tmp/smoke.out; exit 0; fi
}

# Gateway GraphQL
GQL_PAYLOAD='{"query":"query q($playerId: String!){ quote(playerId:$playerId){ playerId mid bid ask tsMs }}","variables":{"playerId":"'$PLAYER_ID'"}}'
status=$(curl -s -o /tmp/smoke.out -w "%{http_code}" -H 'content-type: application/json' -X POST "$GATEWAY_PUBLIC_URL/graphql" --data "$GQL_PAYLOAD") || true
echo "-> POST $GATEWAY_PUBLIC_URL/graphql status=$status"
if [[ "$status" == "200" ]] && grep -q '"data":' /tmp/smoke.out; then echo "GraphQL quote OK"; cat /tmp/smoke.out; exit 0; fi

# Gateway REST variants
try "$GATEWAY_PUBLIC_URL/api/quote?player_id=$PLAYER_ID"
try "$GATEWAY_PUBLIC_URL/v1/quote?player_id=$PLAYER_ID"

# Price-svc direct variants
try "$PRICE_SVC_URL/quote?player_id=$PLAYER_ID"
try "$PRICE_SVC_URL/api/quote?player_id=$PLAYER_ID"
try "$PRICE_SVC_URL/v1/quote?player_id=$PLAYER_ID"

echo "Smoke test failed"; cat /tmp/smoke.out; exit 1
