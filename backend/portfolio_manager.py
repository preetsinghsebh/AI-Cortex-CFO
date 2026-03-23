import json
import os
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

PORTFOLIO_FILE = "portfolio_data.json"

class Trade(BaseModel):
    id: str
    symbol: str
    type: str  # "BUY" or "SELL"
    price: float
    quantity: float
    timestamp: str

class PortfolioState(BaseModel):
    balance: float
    holdings: Dict[str, float]  # symbol -> quantity
    transactions: List[Trade]

class PortfolioManager:
    def __init__(self):
        self.file_path = PORTFOLIO_FILE
        self.state = self._load_state()

    def _load_state(self) -> PortfolioState:
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r") as f:
                    data = json.load(f)
                    return PortfolioState(**data)
            except Exception as e:
                print(f"Error loading portfolio: {e}. Resetting.")
        
        # Default starting state
        return PortfolioState(
            balance=1000000.0,  # ₹10L starting cash
            holdings={
                "RELIANCE.NS": 50,
                "HDFCBANK.NS": 100,
                "TCS.NS": 20
            },
            transactions=[]
        )

    def _save_state(self):
        with open(self.file_path, "w") as f:
            json.dump(self.state.dict(), f, indent=4)

    def get_portfolio(self) -> PortfolioState:
        return self.state

    def execute_trade(self, symbol: str, trade_type: str, price: float, quantity: float) -> dict:
        cost = price * quantity
        
        if trade_type == "BUY":
            if self.state.balance < cost:
                return {"success": False, "message": "Insufficient funds"}
            
            self.state.balance -= cost
            self.state.holdings[symbol] = self.state.holdings.get(symbol, 0) + quantity
            
        elif trade_type == "SELL":
            current_qty = self.state.holdings.get(symbol, 0)
            if current_qty < quantity:
                return {"success": False, "message": "Insufficient holdings"}
            
            self.state.balance += cost
            self.state.holdings[symbol] = current_qty - quantity
            if self.state.holdings[symbol] <= 0:
                del self.state.holdings[symbol]

        # Record transaction
        trade = Trade(
            id=f"txn_{len(self.state.transactions) + 1}",
            symbol=symbol,
            type=trade_type,
            price=price,
            quantity=quantity,
            timestamp=datetime.now().isoformat()
        )
        self.state.transactions.append(trade)
        
        self._save_state()
        return {"success": True, "message": f"Executed {trade_type} {quantity} {symbol} @ ${price}", "trade": trade}
