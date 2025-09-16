// File: gateway/src/mappers/quote.ts
// Purpose: anti-corruption layer from price-svc snake_case → generated proto Quote
import { enginev1 } from "../types/index.js";
import { create } from "@bufbuild/protobuf";

export type RawPriceSvcQuote = {
  // ids
  symbol?: string;
  player_id?: string;
  req_id?: string;

  // prices (mock may use either snake_case or already camel-ish)
  bid_price?: number | string;
  ask_price?: number | string;
  last_price?: number | string;
  bid?: number | string;
  ask?: number | string;
  mid?: number | string;

  // timestamps (mock may use one or the other)
  ts_epoch_ms?: number | string;
  ts_ms?: number | string;
};

const num = (v: unknown) =>
  v === null || v === undefined || v === "" ? undefined : Number(v);

export function mapRawToProtoQuoteResponse(raw: RawPriceSvcQuote): enginev1.QuoteResponse {
  const playerId = (raw.symbol ?? raw.player_id ?? "").toString();

  const bid = num(raw.bid ?? raw.bid_price);
  const ask = num(raw.ask ?? raw.ask_price);

  const mid =
    num(raw.mid) ??
    num(raw.last_price) ??
    (bid != null && ask != null ? (bid + ask) / 2 : 0);

  // accept ts_ms or ts_epoch_ms; fall back to now
  const tsSource = raw.ts_ms ?? raw.ts_epoch_ms ?? Date.now();
  const tsMs = BigInt(Number(tsSource));

  return create(enginev1.QuoteResponseSchema, {
    playerId,
    bid: bid ?? 0,
    ask: ask ?? 0,
    mid: mid ?? 0,
    tsMs,
    reqId: (raw.req_id ?? "").toString(),
  });
}