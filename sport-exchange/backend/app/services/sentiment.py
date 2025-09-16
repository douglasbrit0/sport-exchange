# app/services/sentiment.py

from transformers import pipeline
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Player
import random  # Placeholder for now

# Load sentiment pipeline once
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    truncation=True,
    max_length=512,
    padding=True
)


def fetch_latest_player_text(player_name: str) -> str:
    # TODO: Replace this with real scraping or API call (e.g., Twitter, news)
    return f"{player_name} performed well in the last match and showed strong leadership."

def estimate_volatility(text: str) -> float:
    # TODO: Replace with real NLP model or standard deviation from historical text scores
    return round(random.uniform(0.02, 0.10), 4)

def update_all_player_sentiments():
    db: Session = SessionLocal()

    try:
        players = db.query(Player).all()

        for player in players:
            text = fetch_latest_player_text(player.name)
            result = sentiment_pipeline(text)[0]

            score = result["score"]
            label = result["label"]

            sentiment_score = score if label == "POSITIVE" else -score
            volatility = estimate_volatility(text)

            player.sentiment_score = sentiment_score
            player.volatility = volatility

        db.commit()
        print("✅ Player sentiment scores updated.")

    except Exception as e:
        print("❌ Error updating player sentiments:", str(e))

    finally:
        db.close()

def predict_sentiment(text: str) -> float:
    """
    Returns a sentiment score in the range [-1, 1].
    Positive score for positive sentiment, negative for negative.
    """
    result = sentiment_pipeline(text)[0]
    score = result["score"]
    label = result["label"]

    return score if label == "POSITIVE" else -score

