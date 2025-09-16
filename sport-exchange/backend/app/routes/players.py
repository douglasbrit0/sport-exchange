from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Player
from app.services.pricing import calculate_price

router = APIRouter()
print("✅ players.py loaded")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/players")
def list_players(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    result = []
    for p in players:
        price = calculate_price(p.base_price, p.sentiment_score, p.volatility)
        result.append({
            "id": p.id,
            "name": p.name,
            "team": p.team,
            "position": p.position,
            "price": price,
            "sentiment": p.sentiment_score,
            "volatility": p.volatility
        })
    return result
