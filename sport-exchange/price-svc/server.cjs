const express = require('express');
const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => res.send('ok'));
app.get('/readyz',  (_req, res) => res.send('ok'));

app.get('/quote', (req, res) => {
  const playerId = String(req.query.player_id || '');
  if (!playerId) return res.status(400).json({ error: 'player_id required' });
  const mid = 10.0, bid = +(mid*0.995).toFixed(4), ask = +(mid*1.005).toFixed(4);
  res.json({ player_id: playerId, mid, bid, ask, ts_ms: Date.now() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`price-svc listening on :${PORT}`));
