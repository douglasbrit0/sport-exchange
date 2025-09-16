from sqlalchemy.orm import Session
from app.models import Order, Player

def calculate_price(db: Session, player_id: int) -> float:
    recent_orders = (
        db.query(Order)
        .filter(Order.player_id == player_id)
        .order_by(Order.id.desc())
        .limit(50)
        .all()
    )

    if not recent_orders:
        player = db.query(Player).filter(Player.id == player_id).first()
        return player.price if player else 100.0

    total_volume = sum(o.qty for o in recent_orders)
    if total_volume == 0:
        return 100.0

    # VWAP
    vwap = sum(o.qty * o.executed_price for o in recent_orders) / total_volume

    # Order Imbalance
    buy_volume = sum(o.qty for o in recent_orders if o.side == "buy")
    sell_volume = sum(o.qty for o in recent_orders if o.side == "sell")
    imbalance = (buy_volume - sell_volume) / total_volume

    # Sentiment signal placeholder (for now, use 0)
    sentiment_adjustment = 0.0

    # Final price = VWAP + pressure + sentiment
    price = vwap + (0.05 * vwap * imbalance) + sentiment_adjustment
    return round(price, 2)
