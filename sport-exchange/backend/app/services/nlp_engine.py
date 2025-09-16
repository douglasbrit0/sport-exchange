# services/nlp_engine.py

from random import uniform  # Placeholder for real model
from app.models import Player
from sqlalchemy.orm import Session

def analyze_sentiment(text: str) -> float:
    """
    Simulate sentiment analysis on a player's news/performance text.
    Replace this later with a real transformer model (e.g., FinBERT).
    """
    # Placeholder: pretend we're analyzing the text
    return round(uniform(-0.5, 0.5), 3)

def update_player_sentiment(db: Session, player_id: int, text: str):
    """
    Apply NLP to new text and update the player's sentiment_score.
    """
    score = analyze_sentiment(text)
    player = db.query(Player).filter_by(id=player_id).first()
    if player:
        player.sentiment_score = score
        db.commit()
    return score
