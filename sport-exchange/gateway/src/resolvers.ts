// src/resolvers.ts
import { randomUUID } from "node:crypto";
import type { Resolvers } from "./__generated__/types";
import { getJSON } from "./lib/http";
import { mapRestPlayerToGql } from "./mappers/player";
import { mockPlayers } from "./mocks/players";

const BASE_URL = process.env.PRICE_SVC_URL ?? "http://localhost:8000";

export const resolvers: Resolvers = {
  Query: {
    health: () => "ok",
    version: () => process.env.GIT_SHA ?? "local",
    players: async (_p, { limit = 100, offset = 0 }) => {
      if ((process.env.MOCK_PLAYERS ?? "").trim() === "1") {
        return mockPlayers.slice(offset, offset + limit);
      }
      try {
        const raw = await getJSON<any[]>(`${BASE_URL}/players?limit=${limit}&offset=${offset}`);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapRestPlayerToGql).filter(p => p.id && p.name && p.symbol);
      } catch {
        return [];
      }
    },
    player: async (_p, { id }) => {
      try {
        const raw = await getJSON<any>(`${BASE_URL}/players/${id}`);
        return raw ? mapRestPlayerToGql(raw) : null;
      } catch {
        return null;
      }
    },
  },

  Mutation: {
    _noop: () => true,
    placeOrder: (_p, { order }) => ({
        id: "mock-order-1",
        status: "FILLED",
        filledSize: order.size,
        avgPrice: order.limitPrice ?? 100,
    }),
  },

  // keep these pass-throughs only if your generated Resolvers requires them
  Player: {
        id: p => p.id,
        name: p => p.name,
        symbol: p => p.symbol,

        // nullable -> coalesce to null
        team: p => p.team ?? null,
        position: p => p.position ?? null,

        // non-nullables -> return directly
        price: p => p.price,
        change24h: p => p.change24h,
        volume24h: p => p.volume24h,
        marketCap: p => p.marketCap,
        circulatingSupply: p => p.circulatingSupply,
        totalSupply: p => p.totalSupply,
        volatility24h: p => p.volatility24h,

        // nullable -> coalesce
        sentimentScore: p => (typeof p.sentimentScore === "number" ? p.sentimentScore : null),
        liquidity: p => p.liquidity ?? null,
        ohlc24h: p => p.ohlc24h ?? null,
        contractAddress: p => p.contractAddress ?? null,
        chain: p => p.chain ?? null,
        decimals: p => (typeof p.decimals === "number" ? p.decimals : null),
    },

    Liquidity: {
        depthMid: l => (typeof l.depthMid === "number" ? l.depthMid : null),
        depthBest: l => (typeof l.depthBest === "number" ? l.depthBest : null),
        spreadBps: l => (typeof l.spreadBps === "number" ? l.spreadBps : null),
        ammK: l => (typeof l.ammK === "number" ? l.ammK : null),
    },

    OHLC: {
        open: o => o.open,
        high: o => o.high,
        low: o => o.low,
        close: o => o.close,
        timestamp: o => o.timestamp,
    },
};
