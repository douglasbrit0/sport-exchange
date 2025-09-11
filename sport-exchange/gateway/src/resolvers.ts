// src/resolvers.ts
import { GraphQLError } from "graphql";
import { getJSON } from "./lib/http";
import { mapRestPlayerToGql } from "./mappers/player";
import type { Resolvers } from "./__generated__/types";

const BASE_URL = process.env.PRICE_SVC_URL ?? "http://localhost:8000";

export const resolvers: Resolvers = {
  Query: {
    health: () => "ok",
    version: () => process.env.GIT_SHA ?? "0.1.0",

    players: async (_p, { limit = 100, offset = 0 }) => {
      try {
        const raw = await getJSON<any[]>(`${BASE_URL}/players?limit=${limit}&offset=${offset}`);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapRestPlayerToGql).filter(p => p.id && p.name && p.symbol);
      } catch (e) {
        console.error("players upstream error:", e);
        return [];
      }
    },

    player: async (_p, { id }) => {
      try {
        const raw = await getJSON<any>(`${BASE_URL}/players/${id}`);
        return raw ? mapRestPlayerToGql(raw) : null;
      } catch (e) {
        console.error("player upstream error:", e);
        return null;
      }
    },
  },

  Mutation: { _noop: () => true },

  // Required by your generated Resolvers type
  Player: {
    id: (p) => p.id,
    name: (p) => p.name,
    symbol: (p) => p.symbol,
    team: (p) => p.team,
    position: (p) => p.position,
    price: (p) => p.price,
    change24h: (p) => p.change24h,
    volume24h: (p) => p.volume24h,
    marketCap: (p) => p.marketCap,
    circulatingSupply: (p) => p.circulatingSupply,
    totalSupply: (p) => p.totalSupply,
    volatility24h: (p) => p.volatility24h,
    sentimentScore: (p) => p.sentimentScore,
    liquidity: (p) => p.liquidity,
    ohlc24h: (p) => p.ohlc24h,
    contractAddress: (p) => p.contractAddress,
    chain: (p) => p.chain,
    decimals: (p) => p.decimals,
  },

  Liquidity: {
    depthMid: (l) => l.depthMid,
    depthBest: (l) => l.depthBest,
    spreadBps: (l) => l.spreadBps,
    ammK: (l) => l.ammK,
  },

  OHLC: {
    open: (o) => o.open,
    high: (o) => o.high,
    low: (o) => o.low,
    close: (o) => o.close,
    timestamp: (o) => o.timestamp,
  },
};

