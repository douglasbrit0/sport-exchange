import * as nats from "nats";

const NATS_URL = process.env.NATS_URL ?? "nats://localhost:4222";
const sc = nats.StringCodec();

let ncPromise: Promise<nats.NatsConnection> | null = null;

export async function natsConn(): Promise<nats.NatsConnection> {
  if (!ncPromise) ncPromise = nats.connect({ servers: NATS_URL });
  return ncPromise;
}

export async function requestQuote(payload: unknown, timeoutMs = 1500) {
  const nc = await natsConn();
  const msg = sc.encode(JSON.stringify(payload));
  const r = await nc.request("engine.v1.quote.request", msg, { timeout: timeoutMs });
  return JSON.parse(sc.decode(r.data));
}
