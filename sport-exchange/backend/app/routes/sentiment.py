# routes/sentiment.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.services.nlp_engine import update_player_sentiment
from app.models import Player

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/sentiment")
def set_sentiment(player_id: int, news_text: str, db: Session = Depends(get_db)):
    score = update_player_sentiment(db, player_id, news_text)
    return {
        "player_id": player_id,
        "updated_sentiment_score": score
    }


@router.get("/sentiment")
def get_all_sentiment(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "team": p.team,
            "sentiment_score": round(p.sentiment_score or 0.0, 4),
            "volatility": round(p.volatility or 0.0, 4),
            "current_price": round(p.price or 0.0, 2)
        }
        for p in players
    ]

@router.get("/sentiment/{player_id}")
def get_player_sentiment(player_id: int, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        return {"error": "Player not found"}
    return {
        "id": player.id,
        "name": player.name,
        "sentiment_score": round(player.sentiment_score or 0.0, 4),
        "volatility": round(player.volatility or 0.0, 4),
        "current_price": round(player.price or 0.0, 2)
    }
