import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { PLAYERS, PLACE_ORDER } from "./graphql/queries";

type Player = {
  id: string;
  name: string;
  symbol: string;

  team: string | null;
  position: string | null;

  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  totalSupply: number;
  volatility24h: number;

  sentimentScore: number | null;
  liquidity: number | null;
  ohlc24h: unknown | null;
  contractAddress: string | null;
  chain: string | null;
  decimals: number | null;
}
export default function App() {
  const [limit] = useState(10);
  const [offset] = useState(0);
  const [{ data, fetching, error }] = useQuery({ query: PLAYERS, variables: { limit, offset } });

  const [, placeOrder] = useMutation(PLACE_ORDER);

  const onBuy = async (playerId: string) => {
    await placeOrder({ order: { playerId, side: "BUY", size: 1, limitPrice: 100 } });
    alert("Order submitted (mock)");
  };

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (fetching) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>Error: {error.message}</div>;

  return (
    <div
      style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto" }}
    >
      <h1>Sport Exchange — Hello Markets</h1>
      <p style={{ opacity: 0.7, marginTop: -8 }}>
        Connected to {import.meta.env.VITE_GRAPHQL_URL ?? "/graphql"}
      </p>
      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Symbol</th>
            <th align="right">Price</th>
            <th align="right">Market Cap</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.players?.map((p: Player) => (
            <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{p.name}</td>
              <td>{p.symbol}</td>
              <td align="right">{p.price.toLocaleString()}</td>
              <td align="right">{p.marketCap.toLocaleString()}</td>
              <td align="right">
                <button onClick={() => onBuy(p.id)}>Buy 1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
