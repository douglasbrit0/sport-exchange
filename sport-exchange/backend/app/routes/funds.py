from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import UserBalance, BalanceTransaction

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/deposit")
def deposit_funds(user_id: str, amount: float, db: Session = Depends(get_db)):
    if amount <= 0:
        return {"error": "Deposit amount must be positive"}

    balance = db.query(UserBalance).filter_by(user_id=user_id).first()
    if not balance:
        balance = UserBalance(user_id=user_id, balance=0.0)
        db.add(balance)
        db.commit()
        db.refresh(balance)

    balance.balance += amount

    db.add(BalanceTransaction(
        user_id=user_id,
        amount=amount,
        type="credit",
        description=f"Deposit of ${amount:.2f}"
    ))

    db.commit()
    return {"message": "Deposit successful", "new_balance": round(balance.balance, 2)}

@router.post("/withdraw")
def withdraw_funds(user_id: str, amount: float, db: Session = Depends(get_db)):
    if amount <= 0:
        return {"error": "Withdrawal amount must be positive"}

    balance = db.query(UserBalance).filter_by(user_id=user_id).first()
    if not balance or balance.balance < amount:
        return {"error": "Insufficient funds"}

    balance.balance -= amount

    db.add(BalanceTransaction(
        user_id=user_id,
        amount=-amount,
        type="debit",
        description=f"Withdrawal of ${amount:.2f}"
    ))

    db.commit()
    return {"message": "Withdrawal successful", "new_balance": round(balance.balance, 2)}
