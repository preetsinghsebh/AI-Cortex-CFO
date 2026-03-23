from fastapi import APIRouter, HTTPException
from app.services.news_service import news_service

router = APIRouter()

@router.get("/api/news") # Changed path to include /api prefix explicitly if main doesn't add it globally via APIRouter include
async def get_news():
    try:
        headlines = await news_service.get_latest_headlines()
        return {"headlines": headlines}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
