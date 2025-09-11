from flask import Flask, request, jsonify
import csv, os

app = Flask(__name__)

DATA_CSV = os.path.join(os.path.dirname(__file__), "..", "stage4_data", "stats.csv")
FINAL_FLAG = "YOU-FINISHED-THE-RELAY 🎉"

def compute_lions_sum():
    total = 0
    with open(DATA_CSV, newline="") as f:
        r = csv.DictReader(f)
        for row in r:
            if row.get("team") == "Lions":
                try:
                    total += int(row.get("points", 0))
                except:
                    pass
    return total

@app.get("/")
def root():
    return "Stage 5 API is running. Try /secret?token=APIKEY-<SUM>", 200

@app.get("/secret")
def secret():
    token = request.args.get("token", "").strip()
    expected_sum = compute_lions_sum()
    expected_token = f"APIKEY-{expected_sum}"
    if token != expected_token:
        return jsonify({"ok": False, "error": "Invalid or missing token"}), 403
    return jsonify({
        "ok": True,
        "stage": 5,
        "final_flag": FINAL_FLAG
    }), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
