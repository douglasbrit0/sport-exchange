// gateway/src/routes/quote.ts
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { toJson } from "@bufbuild/protobuf";
import { PriceSvcClient } from "../clients/priceSvc.js";
import { enginev1 } from "../types/index.js";
import { randomUUID } from "crypto";

const querySchema = z.object({
  symbol: z.string().trim().min(1).optional(),
  player_id: z.string().trim().min(1).optional(),
  playerId: z.string().trim().min(1).optional(),
}).refine(
  (q) => !!(q.symbol || q.player_id || q.playerId),
  { message: "symbol or player_id required" }
);

export const makeQuoteHandler = (client: PriceSvcClient) =>
  async function quoteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) correlation id: prefer incoming x-request-id; else generate one
    const incoming = req.header("x-request-id");
    const reqId = (incoming && String(incoming).trim()) || randomUUID();

    // 2) parse query and resolve playerId (symbol | player_id | playerId)
    const q = querySchema.parse(req.query);
    const playerId = q.symbol ?? q.player_id ?? q.playerId!;

    // 3) call downstream
    const msg = await client.getQuote(playerId);

    // 4) serialize to proto-shaped JSON (camelCase), fix tsMs to number,
    //    and ALWAYS include reqId
    const json: any = toJson(enginev1.QuoteResponseSchema, msg);

    if (typeof json.tsMs === "string") {
      const n = Number(json.tsMs);
      json.tsMs = Number.isFinite(n) ? n : undefined; // ensures number or undefined
    }

    json.reqId = reqId;

    // (optional but nice): echo the id back as a header for tracing
    res.setHeader("x-request-id", reqId);

    return res.json(json);
  } catch (err) {
    return next(err);
  }
}