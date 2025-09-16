pub mod pb { tonic::include_proto!("engine.v1"); }

use crate::domain::{quote::Quote, QuoteService};
use pb::{QuoteRequest, QuoteResponse};
use prost_types::Timestamp;
use std::time::{SystemTime, UNIX_EPOCH};
use tonic::{Request, Response, Status};

fn system_time_to_ts(t: SystemTime) -> Timestamp {
    let d = t.duration_since(UNIX_EPOCH).unwrap();
    Timestamp { seconds: d.as_secs() as i64, nanos: d.subsec_nanos() as i32 }
}

impl From<Quote> for QuoteResponse {
    fn from(q: Quote) -> Self {
        QuoteResponse { bid: q.bid, ask: q.ask, ts: Some(system_time_to_ts(q.ts)) }
    }
}

pub struct QuotesGrpc<S> { svc: S }
impl<S> QuotesGrpc<S> { pub fn new(svc: S) -> Self { Self { svc } } }

#[tonic::async_trait]
impl<S: QuoteService + 'static> pb::quotes_server::Quotes for QuotesGrpc<S> {
    async fn get_quote(&self, req: Request<QuoteRequest>) -> Result<Response<QuoteResponse>, Status> {
        let symbol = req.into_inner().symbol;
        let q = self.svc.get_quote(&symbol).await.map_err(|e| Status::internal(e.to_string()))?;
        Ok(Response::new(q.into()))
    }
}
