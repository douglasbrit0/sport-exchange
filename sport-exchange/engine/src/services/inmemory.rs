use crate::domain::{quote::Quote, QuoteService};
use std::time::SystemTime;

pub struct InMemoryQuoteService;

impl InMemoryQuoteService {
    pub fn new() -> Self { Self }
}

#[async_trait::async_trait]
impl QuoteService for InMemoryQuoteService {
    async fn get_quote(&self, _symbol: &str) -> anyhow::Result<Quote> {
        Ok(Quote { bid: 1.23, ask: 1.25, ts: SystemTime::now() })
    }
}
