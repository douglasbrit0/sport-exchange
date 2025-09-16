// /Users/douglas/sport-exchange/engine/src/main.rs
use axum::{routing::get, Router};
use std::{env, net::SocketAddr};
use tokio::task;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // spawn NATS worker (your existing logic)
    task::spawn(nats_worker());

    // readiness HTTP on :17000
    let app = Router::new().route("/readyz", get(|| async { "ok" }));
    let port: u16 = env::var("ENGINE_PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(17000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    axum::serve(tokio::net::TcpListener::bind(addr).await?, app).await?;
    Ok(())
}

async fn nats_worker() -> anyhow::Result<()> {
    // minimal placeholder — keep your existing code here
    // connect to NATS, subscribe, process, etc.
    loop {
        tokio::time::sleep(std::time::Duration::from_secs(3600)).await;
    }
}
