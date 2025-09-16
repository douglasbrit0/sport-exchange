import asyncio, json, os, time
from fastapi import FastAPI
import nats

app = FastAPI()
NATS_URL = os.getenv("NATS_URL", "nats://nats:4222")
SUBJECT = "signals.fair_value"

@app.get("/probe")
def probe():
    return {"status": "ok", "nats": NATS_URL, "subject": SUBJECT}

async def publisher():
    nc = None
    while nc is None:
        try:
            nc = await nats.connect(NATS_URL, name="signals")
        except Exception:
            await asyncio.sleep(1)
    try:
        while True:
            msg = {
                "player_id": "player_001",
                "fair_value": 1.23,
                "sigma": 0.15,
                "ts": int(time.time() * 1000)
            }
            await nc.publish(SUBJECT, json.dumps(msg).encode())
            await asyncio.sleep(60)
    finally:
        await nc.drain()

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(publisher())
