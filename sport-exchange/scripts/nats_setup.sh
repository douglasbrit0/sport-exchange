#!/usr/bin/env bash
set -euo pipefail
if ! command -v nats >/dev/null; then
    echo "nats CLI not found. Install from https://github.com/nats-io/natscli" >&2
    exit 1
fi


NATS_URL="${NATS_URL:-nats://localhost:4222}"


# Stream: engine quote requests (work-queue style)
nats --server "$NATS_URL" str add ENGINE_QUOTE \
    --subjects "engine.v1.quote.request" \
    --storage file --retention work --discard old --max-msgs -1 --max-bytes -1 --max-age 0s --dupe-window 2m --replicas 1 --no-allow-rollup --no-deny-delete --no-deny-purge --defaults || true


# Durable consumer for price-svc
nats --server "$NATS_URL" con add ENGINE_QUOTE price_svc \
    --deliver all --ack explicit --pull --filter "engine.v1.quote.request" \
    --max-deliver 5 --backoff "250ms,1s,3s,10s" --replay instant --sample 0 || true


# Stream: ledger audit (streaming/audit)
nats --server "$NATS_URL" str add LEDGER_QUOTE_AUDIT \
    --subjects "ledger.v1.quote_audit" \
    --storage file --retention limits --discard old --max-msgs -1 --max-bytes -1 --max-age 720h --replicas 1 --no-allow-rollup || true


# Durable consumer for ledger processor
nats --server "$NATS_URL" con add LEDGER_QUOTE_AUDIT ledger \
    --deliver all --ack explicit --pull --filter "ledger.v1.quote_audit" \
    --max-deliver 5 --backoff "250ms,1s,3s,10s" --replay instant || true


echo "JetStream streams/consumers ensured."