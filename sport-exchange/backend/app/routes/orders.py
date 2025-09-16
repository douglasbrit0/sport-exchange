from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Player, Order, Portfolio, UserBalance, BalanceTransaction
from datetime import datetime  
from app.services.trading import execute_order

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/order")
def place_order(user_id: str, player_id: int, side: str, qty: int, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        return {"error": "Player not found"}

    fill_price = execute_order(db, player, side, qty)
    total_cost = fill_price * qty

    # ✅ Get or create user balance
    balance = db.query(UserBalance).filter_by(user_id=user_id).first()
    if not balance:
        balance = UserBalance(user_id=user_id, balance=1000.0)
        db.add(balance)
        db.commit()
        db.refresh(balance)

    if side == "buy":
        if balance.balance < total_cost:
            return {"error": "Insufficient funds"}

        balance.balance -= total_cost

        # ✅ Log debit transaction
        db.add(BalanceTransaction(
            user_id=user_id,
            amount=-total_cost,
            type="debit",
            description=f"Buy {qty} shares of {player.name} at {fill_price:.2f}"
        ))

        position = db.query(Portfolio).filter_by(user_id=user_id, player_id=player_id).first()
        if position:
            total_shares = position.shares + qty
            position.avg_price = ((position.avg_price * position.shares) + (fill_price * qty)) / total_shares
            position.shares = total_shares
        else:
            position = Portfolio(user_id=user_id, player_id=player_id, shares=qty, avg_price=fill_price)
            db.add(position)

    elif side == "sell":
        position = db.query(Portfolio).filter_by(user_id=user_id, player_id=player_id).first()
        if not position or position.shares < qty:
            return {"error": "Insufficient shares"}

        position.shares -= qty
        if position.shares == 0:
            db.delete(position)

        balance.balance += total_cost

        # ✅ Log credit transaction
        db.add(BalanceTransaction(
            user_id=user_id,
            amount=total_cost,
            type="credit",
            description=f"Sell {qty} shares of {player.name} at {fill_price:.2f}"
        ))

    # ✅ Log order
    db.add(Order(
        user_id=user_id,
        player_id=player_id,
        side=side,
        quantity=qty,
        price=fill_price
    ))

    db.commit()
    return {
        "status": "filled",
        "player": player.name,
        "side": side,
        "qty": qty,
        "fill_price": round(fill_price, 2)
    }