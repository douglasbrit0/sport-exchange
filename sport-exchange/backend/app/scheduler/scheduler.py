from apscheduler.schedulers.background import BackgroundScheduler
from app.db import SessionLocal
from app.models import Player
from app.services.pricing import calculate_price
from app.services.sentiment import predict_sentiment
from app.nlp_engine.scraper import aggregate_social_sentiment

def calculate_volatility(player):
    # Simple proxy for volatility based on sentiment deviation
    return 0.1 + 0.2 * abs(player.sentiment_score - 0.5)

def update_player_metrics():
    db = SessionLocal()
    try:
        players = db.query(Player).all()
        for player in players:
            try:
                posts = aggregate_social_sentiment([player.name])
            except Exception as e:
                print(f"❌ Failed to scrape posts for {player.name}: {e}")
                posts = []

            if posts:
                sentiments = [predict_sentiment(text) for text in posts if text.strip()]
                if sentiments:
                    avg_sentiment = sum(sentiments) / len(sentiments)
                    player.sentiment_score = avg_sentiment
                    player.volatility = calculate_volatility(player)

            # Update price using pricing model
            player.price = calculate_price(db, player.id)

            print(f"✅ {player.name} → sentiment={round(player.sentiment_score or 0, 2)}, "
                  f"volatility={round(player.volatility or 0, 2)}, "
                  f"price={round(player.price, 2)}")

            db.add(player)
        db.commit()
    finally:
        db.close()

def start_jobs():
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_player_metrics, "interval", minutes=10)
    scheduler.start()

if __name__ == "__main__":
    update_player_metrics()  # Run once directly
    # start_jobs()  # Uncomment to run on interval
