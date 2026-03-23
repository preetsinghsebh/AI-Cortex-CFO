from app.agents.core import get_latest_news, get_live_market_data, get_stock_quote
import json

print("Testing get_latest_news:")
try:
    news = get_latest_news()
    print(news)
except Exception as e:
    print(f"Error: {e}")

print("\nTesting get_live_market_data:")
try:
    market = get_live_market_data()
    print(market)
except Exception as e:
    print(f"Error: {e}")

print("\nTesting get_stock_quote:")
try:
    quote = get_stock_quote(symbol="RELIANCE")
    print(quote)
except Exception as e:
    print(f"Error: {e}")
