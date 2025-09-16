#!/usr/bin/env bash
set -euo pipefail
MON="${NATS_MONITOR_URL:-http://localhost:8222}"
while true; do
    curl -sf "$MON/varz" | jq '{connections, routes, in_msgs, out_msgs, in_bytes, out_bytes}'
    echo "--- subsz ---" && curl -sf "$MON/subsz" | jq '{num_subscriptions}'
    sleep 1
done