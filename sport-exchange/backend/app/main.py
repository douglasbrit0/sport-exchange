from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routes import players, orders, portfolio, balance, sentiment, transactions, funds
from app.scheduler import scheduler
from app.scheduler.scheduler import start_jobs 



@asynccontextmanager
async def lifespan(app: FastAPI):
    start_jobs()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(players.router)
app.include_router(orders.router)
app.include_router(portfolio.router)
app.include_router(balance.router)
app.include_router(transactions.router)
app.include_router(funds.router)
app.include_router(sentiment.router)