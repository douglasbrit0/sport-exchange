-- Baseline schema example (adjust to your domain)
CREATE TABLE IF NOT EXISTS ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type TEXT NOT NULL,
    ref_id TEXT,
    payload JSONB NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_ledger_entries_event_created ON ledger_entries(event_type, created_at DESC);