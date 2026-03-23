from fastapi import APIRouter, HTTPException
import json
from app.agents.core import get_stock_quote, get_live_market_data, get_stock_news
from app.services.ml_service import ml_service
router = APIRouter()

@router.get("/api/quote/{symbol}")
async def get_quote(symbol: str):
    """Get live quote for a stock"""
    try:
        res = get_stock_quote(symbol=symbol)
        data = json.loads(res)
        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/news/{symbol}")
async def get_single_stock_news(symbol: str):
    """Get latest news for a specific stock"""
    try:
        res = get_stock_news(symbol=symbol)
        data = json.loads(res)
        if isinstance(data, dict) and "error" in data:
            raise HTTPException(status_code=400, detail=data["error"])
        return {"symbol": symbol, "news": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/market/pulse")
async def get_market_pulse():
    """Get live market indices for the dashboard header"""
    try:
        # get_live_market_data returns a JSON string, need to parse or return direct
        res = get_live_market_data()
        return json.loads(res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/signals")
async def get_signals():
    """Returns high-conviction trading signals."""
    return [
        {
            "symbol": "TATASTEEL/NSE",
            "name": "Tata Steel Ltd",
            "type": "BUY",
            "entry": "₹142.50",
            "target": "₹158.00",
            "stopLoss": "₹136.00",
            "timeframe": "1-2 Weeks",
            "risk": "MEDIUM",
            "confidence": 82,
            "reasoning": {
                "technical": "Breakout above 200-EMA with high volume support.",
                "sentiment": "Positive outlook on infra spending in recent news.",
                "volume": "3x average daily volume recorded on Friday.",
                "riskFactors": "Global steel price volatility and China demand slowdown."
            }
        },
        {
            "symbol": "INFY/NSE",
            "name": "Infosys Ltd",
            "type": "SELL",
            "entry": "₹1,620",
            "target": "₹1,540",
            "stopLoss": "₹1,665",
            "timeframe": "Intraday",
            "risk": "LOW",
            "confidence": 74,
            "reasoning": {
                "technical": "Double top pattern on 15m chart. RSI overbought.",
                "sentiment": "Neutral; minor profit booking expected in IT sector.",
                "volume": "Declining buy-side pressure at recent highs.",
                "riskFactors": "Counter-trend rally if Nasdaq surges tonight."
            }
        }
    ]

@router.get("/api/stock/{symbol}/forecast")
async def get_forecast(symbol: str):
    """Get time series forecast for a stock"""
    try:
        return ml_service.predict_stock_price(symbol, forecast_days=7)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/stock/{symbol}/risk")
async def get_risk(symbol: str):
    """Get risk classification for a stock"""
    try:
        return ml_service.classify_stock_risk(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
