# Stage 4 — Data Challenge

Compute a token of the form:
  APIKEY-<SUM>

Where <SUM> is the **total** of the `points` column for rows where `team == "Lions"`
in the provided `stats.csv` file.

Example approach (any language is fine):
- Load the CSV
- Filter rows to team == "Lions"
- Sum the `points` column
- Produce token `APIKEY-<SUM>`

Use your token on Stage 5's endpoint:
`http://127.0.0.1:5000/secret?token=APIKEY-<SUM>`
