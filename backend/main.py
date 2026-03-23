from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routers import chat, news, marcus, stock, sectors
from portfolio_manager import PortfolioManager

app = FastAPI(title="CortexCFO Backend", version="0.1.0")

# Initialize Portfolio Manager
portfolio_manager = PortfolioManager()

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-cortex-cfo-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(news.router)
app.include_router(marcus.router)
app.include_router(stock.router)
app.include_router(sectors.router)

class TradeRequest(BaseModel):
    symbol: str
    type: str
    price: float
    quantity: float

@app.get("/")
async def root():
    return {"message": "CortexCFO Backend Operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/portfolio")
async def get_portfolio():
    return portfolio_manager.get_portfolio()

@app.post("/api/trade/execute")
async def execute_trade(trade: TradeRequest):
    result = portfolio_manager.execute_trade(
        trade.symbol, 
        trade.type, 
        trade.price, 
        trade.quantity
    )
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result
