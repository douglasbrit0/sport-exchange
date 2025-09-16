# backend/scripts/check_players.py
from app.db import SessionLocal
from app.models import Player

db = SessionLocal()
players = db.query(Player).all()
print(f"📦 {len(players)} players in DB:")
for p in players:
    print(f"- {p.name}")
db.close()
