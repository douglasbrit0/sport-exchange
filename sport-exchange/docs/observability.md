## Metrics: Local Scraping & Healthy Ranges

**Endpoints**
- Gateway Prometheus endpoint: `http://localhost:4000/metrics`

**Quick checks**
- Process/runtime present:
  ```bash
  curl -sf http://localhost:4000/metrics | egrep -m1 '^process_|^nodejs_'