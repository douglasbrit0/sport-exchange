from app.services.pricing import calculate_price
from sqlalchemy.orm import Session

def execute_order(db: Session, player, side: str, qty: int) -> float:
    """
    Calculate dynamic price using recent trades (VWAP), order imbalance,
    and player-specific factors like sentiment and volatility.
    """
    base_price = player.base_price
    sentiment = player.sentiment_score or 0.0
    volatility = player.volatility or 0.1  # fallback

    # Use VWAP and imbalance from order book
    vwap_price = calculate_price(db, player.id)

    # Modify final price with sentiment and volatility
    sentiment_adj = 0.02 * vwap_price * sentiment
    volatility_adj = 0.01 * vwap_price * volatility

    fill_price = vwap_price + sentiment_adj + volatility_adj

    # Save updated price back to player
    player.price = fill_price
    db.commit()

    return round(fill_price, 2)
