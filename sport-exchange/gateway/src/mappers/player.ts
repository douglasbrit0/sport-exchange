import type { Player } from "../__generated__/types";

// Helpers
const n = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const s = (v: unknown, fallback = ""): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;

export const mapRestPlayerToGql = (p: any): Player => {
  // Required non-nullables in your SDL:
  // id, name, symbol, price, change24h, volume24h, marketCap,
  // circulatingSupply, totalSupply, volatility24h
  // Make sure we can populate them with safe values.
  const price = n(p?.price, 0);
  const circ = n(p?.circulating_supply, 0);
  const total = n(p?.total_supply, circ); // fall back to circ if missing
  const mcap = price * (circ || 0);

  return {
    id: s(p?.id, s(p?.symbol, "UNKNOWN")),   // prefer id, fallback to symbol
    name: s(p?.name, "Unknown"),
    symbol: s(p?.symbol, "UNK"),
    team: p?.team ?? null,
    position: p?.position ?? null,

    price,
    change24h: n(p?.change_24h, 0),
    volume24h: n(p?.volume_24h, 0),
    marketCap: n(mcap, 0),
    circulatingSupply: circ,
    totalSupply: total,
    volatility24h: n(p?.vol_24h, 0),

    sentimentScore: typeof p?.sentiment === "number" ? p.sentiment : null,

    liquidity: p?.liq
      ? {
          depthMid: typeof p.liq.depth_mid === "number" ? p.liq.depth_mid : null,
          depthBest: typeof p.liq.depth_best === "number" ? p.liq.depth_best : null,
          spreadBps: typeof p.liq.spread_bps === "number" ? p.liq.spread_bps : null,
          ammK: typeof p.liq.amm_k === "number" ? p.liq.amm_k : null,
        }
      : null,

    ohlc24h: p?.ohlc_24h
      ? {
          open: n(p.ohlc_24h.open, price),
          high: n(p.ohlc_24h.high, price),
          low: n(p.ohlc_24h.low, price),
          close: n(p.ohlc_24h.close, price),
          timestamp: s(p.ohlc_24h.ts, new Date().toISOString()),
        }
      : null,

    contractAddress: p?.contract_address ?? null,
    chain: p?.chain ?? null,
    decimals: typeof p?.decimals === "number" ? p.decimals : null,
  };
};
