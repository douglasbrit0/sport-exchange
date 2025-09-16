from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Player

# Optional: Clear old data first
def clear_existing_players(db: Session):
    db.query(Player).delete()
    db.commit()

def seed_players():
    db = SessionLocal()
    clear_existing_players(db)

    fake_players = [
        {"name": "Kylian Mbappé", "team": "PSG", "position": "FWD", "price": 75.0, "sentiment_score": 0.8, "volatility": 0.2},
        {"name": "Lionel Messi", "team": "Inter Miami", "position": "FWD", "price": 68.0, "sentiment_score": 0.9, "volatility": 0.1},
        {"name": "Bukayo Saka", "team": "Arsenal", "position": "MID", "price": 52.0, "sentiment_score": 0.7, "volatility": 0.3},
        {"name": "Jude Bellingham", "team": "Real Madrid", "position": "MID", "price": 60.0, "sentiment_score": 0.85, "volatility": 0.25},
        {"name": "Virgil van Dijk", "team": "Liverpool", "position": "DEF", "price": 45.0, "sentiment_score": 0.6, "volatility": 0.15}
    ]

    for p in fake_players:
        player = Player(
            name=p["name"],
            team=p["team"],
            position=p["position"],
            price=p["price"],
            sentiment_score=p["sentiment_score"],
            volatility=p["volatility"]
        )
        db.add(player)

    db.commit()
    db.close()
    print("✅ Seeded players!")

if __name__ == "__main__":
    seed_players()
