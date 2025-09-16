pub mod quote;

#[async_trait::async_trait]
pub trait QuoteService: Send + Sync {
    async fn get_quote(&self, symbol: &str) -> anyhow::Result<quote::Quote>;
}
