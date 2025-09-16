---
name: "Ledger Core Ticket"
about: "Implement double-entry ledger with idempotent APIs"
title: "[Ledger] "
labels: ["backend", "ledger"]
---

## Description
Implement part of the core double-entry ledger system.

---

### Tasks
- [ ] Define database schema (journals, entries, accounts).
- [ ] Write migrations + constraints.
- [ ] Add API endpoints.
- [ ] Unit + integration tests.
- [ ] Emit events.

---

### Acceptance Criteria

#### Ledger Data Model
**Given** a journal with Σdebit = Σcredit  
**When** it is inserted into the DB  
**Then** insertion succeeds and balances are correct.  

**Given** a journal with Σdebit ≠ Σcredit  
**When** insertion is attempted  
**Then** DB rejects with constraint error.  

**Given** an existing entry  
**When** an update or delete is attempted  
**Then** DB rejects with error (immutability enforced).  

---

#### System Accounts
**Given** the seed script runs  
**When** queried for accounts like `USER_CASH:1`, `FEE_REVENUE`  
**Then** they exist exactly once and have unique IDs.  

---

#### Idempotent Transfer Endpoint
**Given** a POST `/ledger/transfer {external_id: X}`  
**When** called twice with the same payload  
**Then** first returns 201 with journal, second returns 200 with the same journal (no duplicate).  

---

#### Balance Views
**Given** a sequence of journals applied  
**When** `/ledger/account/:id/balance` is queried  
**Then** it equals Σ(credits – debits) for that account.  

---

#### Event Emission
**Given** a journal is posted  
**When** event bus is consumed  
**Then** exactly one `LedgerPosted` event appears with matching IDs.  
