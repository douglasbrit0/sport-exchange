# models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    team = Column(String, index=True)
    position = Column(String, index=True)
    price = Column(Float, default=100.0)
    sentiment_score = Column(Float, default=0.0)
    volatility = Column(Float, default=0.1)

    orders = relationship("Order", back_populates="player")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    side = Column(String)  # "buy" or "sell"
    qty = Column(Integer)
    executed_price = Column(Float)

    player = relationship("Player", back_populates="orders")

class UserBalance(Base):
    __tablename__ = "user_balances"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True, index=True)
    balance = Column(Float, default=1000.0)

class BalanceTransaction(Base):
    __tablename__ = "balance_transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)  # "credit" or "debit"
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    shares = Column(Integer)
    avg_price = Column(Float)
