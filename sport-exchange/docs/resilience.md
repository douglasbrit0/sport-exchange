## Resilience Policy (Gateway → price-svc)

**Knobs (env)**
- `PRICE_SVC_TIMEOUT_MS` — per-attempt timeout (ms).
- `PRICE_SVC_RETRIES` — total **attempts** (includes the first try).
- `PRICE_SVC_BACKOFF_BASE_MS` — exponential backoff base between attempts; jitter is added.

**Behavior**
- Retries on **5xx** and network errors.
- **No retries on 4xx** (client errors).
- Backoff schedule: `base * 2^(attempt-1) + jitter` (e.g., 100ms, 200ms, …).
- Correlation: `x-request-id` is propagated and echoed as `reqId` in JSON and header.

**Operational expectations**
- When `price-svc` is **down**, requests to `/api/quote` will take approximately  
  `TIMEOUT_MS × RETRIES + backoffs` before failing.
- When `price-svc` is **healthy**, `/api/quote` should typically complete **<300ms** locally.
- On startup, gateway logs the active settings:

[price-svc] timeoutMs=<...> retries=<...> backoffBaseMs=<...>

**Manual drill (local)**
1. Confirm healthy baseline timings (`curl -w time_total`).
2. Stop `price-svc`, call `/api/quote`, observe increased latency and error.
3. Start `price-svc` again, calls succeed and latencies return to normal.
