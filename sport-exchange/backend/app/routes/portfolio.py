from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Portfolio, Player

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/portfolio")
def get_portfolio(user_id: str, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter_by(user_id=user_id).all()
    response = []

    for pos in portfolio:
        player = db.query(Player).filter_by(id=pos.player_id).first()
        if not player:
            continue

        current_price = player.base_price  # or use full pricing model
        market_value = pos.shares * current_price
        cost_basis = pos.shares * pos.avg_price
        unrealized_pnl = market_value - cost_basis

        response.append({
            "player": player.name,
            "shares": pos.shares,
            "avg_price": round(pos.avg_price, 2),
            "current_price": round(current_price, 2),
            "market_value": round(market_value, 2),
            "unrealized_pnl": round(unrealized_pnl, 2)
        })

    return response
