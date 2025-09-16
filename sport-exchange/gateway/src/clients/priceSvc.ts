// File: gateway/src/clients/priceSvc.ts
// Purpose: tiny HTTP client with timeout; mapping done in mapper.

import assert from "node:assert";
// Note: we don't need to import enginev1 here; the mapper returns the right shape.
import { mapRawToProtoQuoteResponse, type RawPriceSvcQuote } from "../mappers/quote.js";

const DEFAULT_TIMEOUT_MS = Number(process.env.PRICE_SVC_TIMEOUT_MS ?? 3000);
const RETRIES = Number(process.env.PRICE_SVC_RETRIES ?? 3);
const BACKOFF_BASE_MS = Number(process.env.PRICE_SVC_BACKOFF_BASE_MS ?? 100);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface PriceSvcClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export class PriceSvcClient {
  readonly baseUrl: string;
  readonly timeoutMs: number;

  constructor(opts: PriceSvcClientOptions) {
    assert(opts.baseUrl, "PriceSvcClient: baseUrl is required");
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    // Log knobs on startup for resilience docs
    // (This runs when the gateway constructs the client.)
    // eslint-disable-next-line no-console
    console.info(
      `[price-svc] timeoutMs=${this.timeoutMs} retries=${RETRIES} backoffBaseMs=${BACKOFF_BASE_MS}`
    );
  }

  private static isRetryableStatus(status: number) {
    // Retry 5xx; do NOT retry 4xx
    return status >= 500 && status <= 599;
  }

  private async fetchJsonWithRetry(url: string): Promise<RawPriceSvcQuote> {
    let lastErr: unknown;

    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      try {
        // Timeout via AbortController
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(new Error("timeout")), this.timeoutMs);

        const res = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
          signal: ac.signal,
        });

        clearTimeout(timer);

        if (res.ok) {
          return (await res.json()) as RawPriceSvcQuote;
        }

        // 4xx => no retry
        if (res.status >= 400 && res.status < 500) {
          const body = await PriceSvcClient.safeText(res);
          throw new Error(
            `price-svc responded ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`
          );
        }

        // 5xx => retry
        if (PriceSvcClient.isRetryableStatus(res.status)) {
          const body = await PriceSvcClient.safeText(res);
          throw new Error(
            `price-svc 5xx ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`
          );
        }

        // Other unexpected statuses (rare)
        const body = await PriceSvcClient.safeText(res);
        throw new Error(
          `price-svc unexpected status ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`
        );
      } catch (err) {
        lastErr = err;

        // If we've used all attempts, stop
        if (attempt >= RETRIES) break;

        // Exponential backoff with jitter
        const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * BACKOFF_BASE_MS);
        await sleep(delay + jitter);
      }
    }

    // If we get here, we failed all attempts
    throw lastErr ?? new Error("Unknown error contacting price-svc");
  }

  private static async safeText(res: Response): Promise<string> {
    try {
      return await res.text();
    } catch {
      return "";
    }
  }

  async getQuote(playerId: string) {
    const url = `${this.baseUrl}/quote?player_id=${encodeURIComponent(playerId)}`;
    const raw = await this.fetchJsonWithRetry(url);
    return mapRawToProtoQuoteResponse(raw);
  }
}
