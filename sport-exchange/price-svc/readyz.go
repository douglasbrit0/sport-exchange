package pricesvc

from fastapi import APIRouter
from httpx import AsyncClient


router = APIRouter()


@router.get('/readyz')
async def readyz():
	# Add dependency checks here if needed
	return 'ok'