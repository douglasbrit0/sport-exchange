# Sport Exchange
Monorepo for The Sport Exchange MVP.

## Structure
- `gateway/` – GraphQL API Gateway (TypeScript/Node)
- `ledger/` – Ledger service (Go)
- `reconciler/` – Reconciliation service (Go)
- `engine/` – AMM/Execution engine (Rust)
- `signals/` – NLP & research services (Python)
- `frontend/` – React/TS client
- `contracts/` – Shared schemas (GraphQL, Protobuf, Avro)
- `infra/` – IaC (Terraform, Docker Compose, k8s manifests)
- `ops/` – Dashboards, runbooks
- `tools/` – Dev scripts

## Dev commands
```bash
make dev-up     # spin up all services with Docker Compose
make dev-down   # tear down
make test-all   # run all tests
cat >> README.md << 'EOF'
## Structure
- `gateway/` – GraphQL API Gateway (TypeScript/Node)
- `ledger/` – Ledger service (Go)
- `reconciler/` – Reconciliation service (Go)
- `engine/` – AMM/Execution engine (Rust)
- `signals/` – NLP & research services (Python)
- `frontend/` – React/TS client
- `contracts/` – Shared schemas (GraphQL, Protobuf, Avro)
- `infra/` – IaC (Terraform, Docker Compose, k8s manifests)
- `ops/` – Dashboards, runbooks
- `tools/` – Dev scripts

## Dev commands
```bash
make dev-up     # spin up all services with Docker Compose
make dev-down   # tear down
make test-all   # run all tests
