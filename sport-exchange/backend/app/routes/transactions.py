from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import BalanceTransaction
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/transactions")
def get_transactions(user_id: str, db: Session = Depends(get_db)):
    transactions = db.query(BalanceTransaction)\
        .filter(BalanceTransaction.user_id == user_id)\
        .order_by(BalanceTransaction.timestamp.desc())\
        .all()

    return [
        {
            "timestamp": tx.timestamp.isoformat(),
            "type": tx.type,
            "amount": round(tx.amount, 2),
            "description": tx.description
        } for tx in transactions
    ]
