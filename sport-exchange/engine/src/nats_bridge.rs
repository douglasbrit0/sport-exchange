use nats::{self, Message};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;


#[derive(Deserialize)]
struct QuoteReq { player_id: String, market: String, req_id: String }


#[derive(Serialize)]
struct QuoteResp { player_id: String, bid: f64, ask: f64, mid: f64, ts_ms: i64, req_id: String }


#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let nats_url = env::var("NATS_URL").unwrap_or_else(|_| "nats://localhost:4222".into());
    let price_url = env::var("PRICE_SVC_URL").unwrap_or_else(|_| "http://localhost:18000".into());
    let nc = nats::asynk::connect(&nats_url).await?;
    let sub = nc.queue_subscribe("engine.v1.quote.request", "price-workers").await?;
    let http = Client::new();


    while let Some(msg) = sub.next().await {
    handle(&http, &nc, &price_url, msg).await.ok();
    }
    Ok(())
}


async fn handle(http: &Client, nc: &nats::asynk::Connection, price_url: &str, msg: Message) -> anyhow::Result<()> {
    let req: QuoteReq = serde_json::from_slice(&msg.data)?;
    let url = format!("{}/quote?player_id={}", price_url, req.player_id);
    let resp = http.get(&url).send().await?.json::<serde_json::Value>().await?;
    // Map fields from price-svc to response (adjust as needed)
    let mid = resp["mid"].as_f64().unwrap_or(0.0);
    let bid = resp["bid"].as_f64().unwrap_or(mid * 0.995);
    let ask = resp["ask"].as_f64().unwrap_or(mid * 1.005);
    let out = QuoteResp { player_id: req.player_id, bid, ask, mid, ts_ms: chrono::Utc::now().timestamp_millis(), req_id: req.req_id };
    if let Some(reply_to) = msg.reply { nc.publish(&reply_to, serde_json::to_vec(&out)?).await?; }
    Ok(())
}