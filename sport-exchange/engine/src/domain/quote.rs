use std::time::SystemTime;

pub struct Quote {
    pub bid: f64,
    pub ask: f64,
    pub ts: SystemTime,
}
