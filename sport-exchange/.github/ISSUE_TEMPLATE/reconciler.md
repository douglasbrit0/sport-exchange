---
name: "Reconciler Ticket"
about: "Implement real-time reconciliation and trade→ledger adapter"
title: "[Reconciler] "
labels: ["backend", "reconciliation"]
---

## Description
Implement reconciliation engine to ensure trades map 1:1 with ledger postings and system invariants hold.

---

### Tasks
- [ ] Map `TradeExecuted` → cash + inventory journals.
- [ ] Subscribe to event bus.
- [ ] Implement invariant checks.
- [ ] Add alerting + dashboards.
- [ ] Write fuzz/idempotency tests.

---

### Acceptance Criteria

#### Execution → Ledger Adapter
**Given** a `TradeExecuted` event  
**When** processed  
**Then** 2 journals are created:  
- Cash leg: buyer/seller cash + fees.  
- Inventory leg: player positions.  
And both are balanced (Σdebit = Σcredit).  

---

#### Real-Time Reconciler
**Given** a trade fires  
**When** reconciler subscribes  
**Then** journals appear within 2s and invariants hold:  
- Per-currency: Σ(user cash + system accounts) = 0  
- Per-player: Σ(user positions) = engine position  

**Given** a synthetic drift is injected  
**When** reconciler runs  
**Then** it raises “at risk” flag and alert.  

---

#### Daily Batch Check
**Given** end-of-day snapshot is taken  
**When** independently rebuilt from event log  
**Then** hash of balances matches exactly.  

---

#### Idempotency Audit
**Given** `placeOrder` or `transfer` is retried with same `external_id`  
**When** fuzz tested with random retry patterns  
**Then** resulting ledger state is identical, no duplicates.  

---

#### Runbook + Dashboards
**Given** dashboards are live  
**When** journal throughput or reconcile drift is queried  
**Then** metrics display real-time.  

**Given** drift > 0 detected  
**When** operator reads runbook  
**Then** steps include: freeze withdrawals, inspect journals, replay events.  
