from fastapi import APIRouter, HTTPException
import yfinance as yf
import asyncio

router = APIRouter()

# Mapping of Sector Name to NSE Index Symbol
SECTOR_INDICES = {
    "Nifty Bank": "^NSEBANK",
    "Nifty IT": "^CNXIT",
    "Nifty Auto": "^CNXAUTO",
    "Nifty Pharma": "^CNXPHARMA",
    "Nifty FMCG": "^CNXFMCG",
    "Nifty Metal": "^CNXMETAL",
    "Nifty Energy": "^CNXENERGY",
    "Nifty Infra": "^CNXINFRA"
}


def get_sector_data_sync(name: str, symbol: str):
    """Blocking yfinance call to get data for a single sector."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.fast_info
        
        # Calculate % Change
        current_price = info.last_price
        prev_close = info.previous_close
        
        if prev_close and prev_close > 0:
            change = current_price - prev_close
            percent_change = (change / prev_close) * 100
        else:
            change = 0.0
            percent_change = 0.0

        return {
            "name": name,
            "symbol": symbol,
            "price": round(current_price, 2),
            "change": round(change, 2),
            "percentChange": round(percent_change, 2),
            "volume": info.last_volume if hasattr(info, 'last_volume') else 0
        }
    except Exception as e:
        print(f"Error fetching {name} ({symbol}): {e}")
        return {
            "name": name,
            "symbol": symbol,
            "price": 0.0,
            "change": 0.0,
            "percentChange": 0.0,
            "error": True
        }

@router.get("/api/market/sectors")
async def get_sector_performance():
    """Returns real-time performance of key Indian sectors."""
    tasks = [asyncio.to_thread(get_sector_data_sync, name, symbol) for name, symbol in SECTOR_INDICES.items()]
    results = await asyncio.gather(*tasks)
    
    # Sort by Percent Change (Winners first)
    sorted_results = sorted(results, key=lambda x: x['percentChange'], reverse=True)
    
    return {"sectors": sorted_results}
