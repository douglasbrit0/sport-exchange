import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import client from "prom-client";

import { makeQuoteHandler } from "./routes/quote.js";
import { PriceSvcClient } from "./clients/priceSvc.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = Number(process.env.PORT ?? 4000);
const PRICE_SVC_URL = process.env.PRICE_SVC_URL ?? "http://price-svc:8000";
const GRAPHQL_ENABLED = process.env.GRAPHQL_ENABLED === "true";

const priceClient = new PriceSvcClient({ baseUrl: PRICE_SVC_URL });

/** ── Prometheus metrics ─────────────────────────────────────────────── */
client.collectDefaultMetrics(); // process + runtime

// duration histogram with method/path/status
const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "path", "status"] as const,
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

// timing middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, path: req.path });
  res.on("finish", () => end({ status: String(res.statusCode) }));
  next();
});

// /metrics endpoint
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
/** ───────────────────────────────────────────────────────────────────── */

/** REST */
app.get("/api/quote", makeQuoteHandler(priceClient));
app.get("/healthz", (_req, res) => res.type("text/plain").send("ok"));

async function start() {
  if (GRAPHQL_ENABLED) {
    const mod = await (eval("import")("./graphql.js") as Promise<any>);
    await mod.registerGraphQL(app, priceClient);
    console.log("GraphQL enabled at /graphql");
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`gateway listening on :${PORT}`));
}
start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
