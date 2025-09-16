# routes/balance.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import UserBalance, BalanceTransaction

router = APIRouter()

@router.get("/balance")
def get_balance(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserBalance).filter(UserBalance.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_id": user_id, "balance": user.balance}

@router.post("/balance")
def update_balance(user_id: str, amount: float, db: Session = Depends(get_db)):
    user = db.query(UserBalance).filter(UserBalance.user_id == user_id).first()

    if not user:
        if amount < 0:
            raise HTTPException(status_code=400, detail="Cannot create user with negative balance")
        user = UserBalance(user_id=user_id, balance=amount)
        db.add(user)
    else:
        new_balance = user.balance + amount
        if new_balance < 0:
            raise HTTPException(status_code=400, detail="Insufficient funds")
        user.balance = new_balance

    # Log the transaction
    transaction = BalanceTransaction(user_id=user_id, amount=amount)
    db.add(transaction)

    db.commit()
    db.refresh(user)
    return {"user_id": user_id, "balance": user.balance}

