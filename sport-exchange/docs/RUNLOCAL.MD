# Run locally
**Prereqs:** Docker Desktop, jq, curl, Node 20+ (host only for tools).

```bash
./scripts/check_port_4000.sh
make up
make health
make smoke
make tail   # follow logs