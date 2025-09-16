import jsonServer from "json-server";

const PORT = process.env.PORT || 8000;
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ logger: true });

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Health + readiness
server.get("/healthz", (_req, res) => res.status(200).send("ok"));
server.get("/readyz",  (_req, res) => res.status(200).send("ok"));

// Minimal quote endpoint
server.get("/quote", (req, res) => {
  const playerId = String(req.query.player_id ?? "");
  if (!playerId) return res.status(400).json({ error: "player_id required" });
  const mid = 10.0;
  const bid = +(mid * 0.995).toFixed(4);
  const ask = +(mid * 1.005).toFixed(4);
  res.json({ player_id: playerId, mid, bid, ask, ts_ms: Date.now() });
});

// Keep your existing players paging tweaks (if any)
server.use((req, _res, next) => {
  if (req.method === "GET" && req.path.startsWith("/players")) {
    const { limit, offset } = req.query;
    if (limit != null)  req.query._limit = String(limit);
    if (offset != null) req.query._start = String(offset);
  }
  next();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`mock-price-svc listening on http://0.0.0.0:${PORT}`);
});
