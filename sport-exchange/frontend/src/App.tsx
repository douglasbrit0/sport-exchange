import { useEffect, useMemo, useState } from "react";
import {
  usePlayersQuery,
  usePlaceOrderMutation,
  type PlayersQuery,
  OrderSide,
} from "./__generated__/gql";

type Player = PlayersQuery["players"][number];

export default function App() {
  // server-side pagination controls
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  // search (client-side filter over the current page)
  const [q, setQ] = useState("");

  const [{ data, fetching, error }] = usePlayersQuery({
    variables: { limit, offset },
  });
  const [, placeOrder] = usePlaceOrderMutation();

  const [placingId, setPlacingId] = useState<string | null>(null);

  const fmt0 = useMemo(() => new Intl.NumberFormat(), []);
  const fmt2 = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }),
    []
  );
  const fmtPct = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        signDisplay: "always",
        maximumFractionDigits: 2,
      }),
    []
  );

  // sort by market cap DESC and apply search filter on the current page
  const players = useMemo(() => {
    const page = (data?.players ?? []).slice().sort(
      (a: Player, b: Player) => b.marketCap - a.marketCap
    );
    if (!q.trim()) return page;
    const needle = q.trim().toLowerCase();
    return page.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.symbol.toLowerCase().includes(needle)
    );
  }, [data?.players, q]);

  const onBuy = async (playerId: string) => {
    try {
      setPlacingId(playerId);
      const res = await placeOrder({
        order: {
          playerId,
          side: OrderSide.Buy,
          size: 1,
          limitPrice: 100,
        },
      });
      if (res.error) throw res.error;
      alert(`Order ${res.data?.placeOrder.id} (${res.data?.placeOrder.status})`);
    } catch (e) {
      console.error(e);
      alert("Order failed");
    } finally {
      setPlacingId(null);
    }
  };

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (fetching && !data)
    return <div style={{ padding: 16 }}>Loading market data…</div>;
  if (error)
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        Error: {error.message}
      </div>
    );

  // simple next/prev: we don’t know total; assume no next if fewer than limit
  const hasPrev = offset > 0;
  const hasNext = (data?.players?.length ?? 0) >= limit;

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <h1>Sport Exchange — Hello Markets</h1>
      <p style={{ opacity: 0.7, marginTop: -8 }}>
        Connected to {import.meta.env.VITE_GRAPHQL_URL ?? "/graphql"}
      </p>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "16px 0",
          flexWrap: "wrap",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or symbol…"
          style={{
            padding: "8px 10px",
            border: "1px solid #ddd",
            borderRadius: 8,
            minWidth: 220,
          }}
        />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <label>
            Show{" "}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
          <button
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            disabled={!hasPrev}
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setOffset((o) => o + limit)}
            disabled={!hasNext}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Table */}
      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Symbol</th>
            <th align="right">Price</th>
            <th align="right">24h</th>
            <th align="right">Market Cap</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {players.map((p) => {
            const color =
              p.change24h > 0 ? "#0c8" : p.change24h < 0 ? "#e44" : "#888";
            const arrow =
              p.change24h > 0 ? "▲" : p.change24h < 0 ? "▼" : "•";
            return (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{p.name}</td>
                <td style={{ opacity: 0.8 }}>{p.symbol}</td>
                <td align="right">{fmt2.format(p.price)}</td>
                <td align="right" style={{ color }}>
                  {arrow} {fmtPct.format(p.change24h)}
                </td>
                <td align="right">{fmt0.format(p.marketCap)}</td>
                <td align="right">
                  <button
                    onClick={() => onBuy(p.id)}
                    disabled={placingId === p.id}
                    aria-busy={placingId === p.id}
                  >
                    {placingId === p.id ? "Buying…" : "Buy 1"}
                  </button>
                </td>
              </tr>
            );
          })}
          {players.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: "center", opacity: 0.7 }}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
