# Stage 5 — API Finish

## Run
```
cd stage5_api
# (Optional) python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Check Your Token
Open:
```
http://127.0.0.1:5000/secret?token=APIKEY-<SUM>
```
Where `<SUM>` is from Stage 4. If correct, you'll receive the final flag in JSON.
