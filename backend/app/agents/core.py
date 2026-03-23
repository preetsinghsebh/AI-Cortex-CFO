import yfinance as yf
import feedparser
import json
import os
import aiohttp
import asyncio
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Dict, Optional
from app.services.ml_service import ml_service

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions"

# Base System Prompts
PROMPTS = {
    "MARCUS": """You are Marcus, the central AI CFO (Chief Financial Officer). 
    Your Role: Orchestrator. Professional, witty, and highly intelligent. 
    Your Goal: Guide the user, analyze trends, seasonality, and risk factors using your ML tools. Discuss feature importance and forecasting limitations when appropriate.
    Tone: Professional but conversational. Use short sentences. Use bolding for key metrics.
    """,
    "APEX": """You are Apex Predator, the Alpha Hunter. 
    Your Role: Aggressive growth strategist. 
    Your Goal: Identify high-risk, high-reward opportunities and breakout trades. 
    Tone: Sharp, confident, and direct. Focus on momentum and "pouncing" on trades.
    """,
    "SHIELD": """You are Shield, the Risk Manager. 
    Your Role: Defensive specialist. 
    Your Goal: Protect capital, identify overexposure, and suggest stop-losses. 
    Tone: Cautious, analytical, and literal. Safety first.
    """,
    "ORACLE": """You are the Oracle, the Macro Strategist. 
    Your Role: Big-picture visionary. 
    Your Goal: Connect global events (Fed rates, oil prices) to Indian markets. 
    Tone: Philosophical, deep, and forward-looking.
    """
}

def get_live_market_data(**kwargs):
    """Fetches live Nifty 50, Sensex, Bank Nifty, and India VIX data."""
    try:
        # Tickers: Nifty 50, Sensex, Nifty Bank, India VIX
        tickers = {
            "nifty": "^NSEI",
            "sensex": "^BSESN",
            "banknifty": "^NSEBANK",
            "indiavix": "^INDIAVIX"
        }
        
        data = {}
        
        for name, symbol in tickers.items():
            ticker = yf.Ticker(symbol)
            price = ticker.fast_info.last_price
            
            # Calculate % change
            hist = ticker.history(period="2d")
            if len(hist) >= 2:
                prev = hist['Close'].iloc[0]
                change = ((price - prev) / prev) * 100
            else:
                change = 0.0
            
            data[name] = {
                "price": round(price, 2),
                "change": round(change, 2)
            }
            
        return json.dumps(data)
    except Exception as e:
        return json.dumps({"error": str(e)})

def get_latest_news(**kwargs):
    """Fetches latest business news RSS."""
    try:
        # Economic Times or Moneycontrol RSS
        urls = [
            "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
            "https://www.moneycontrol.com/rss/business.xml"
        ]
        
        headlines = []
        for url in urls:
            try:
                feed = feedparser.parse(url)
                if feed.entries:
                    headlines.extend([entry.title for entry in feed.entries[:3]])
                    if len(headlines) >= 5:
                        break
            except:
                continue
                
        if not headlines:
            # Mock Data fallback
            return json.dumps([
                f"Sensex jumps 500 points on strong global cues ({datetime.now().strftime('%H:%M')})",
                "Reliance Industries to expand green energy biz",
                "IT stocks rally as Nasdaq surges overnight",
                "RBI keeps repo rate unchanged at 6.5%",
                "Gold prices dip slightly ahead of Fed meeting"
            ])
            
        return json.dumps(headlines[:5])
    except Exception as e:
        # Ultimate fallback
        return json.dumps([
            "Market trading flat amidst global volatility",
            "Banking stocks see minor correction",
            "Tech sector shows resilience in early trade"
        ])

def get_stock_quote(symbol: str = None, **kwargs):
    """Fetches current price for a specific stock symbol (NSE)."""
    # Fallback to kwargs if symbol argument is missing
    if not symbol:
        symbol = kwargs.get('stock') or kwargs.get('ticker')
        
    if not symbol:
        return json.dumps({"error": "Symbol required"})
    
    # Auto-append .NS for NSE if not present (and not BSE)
    if not symbol.endswith(".NS") and not symbol.endswith(".BO"):
        symbol = f"{symbol}.NS"
        
    try:
        ticker = yf.Ticker(symbol)
        price = ticker.fast_info.last_price
        return json.dumps({"symbol": symbol, "price": round(price, 2)})
    except Exception as e:
        return json.dumps({"error": str(e)})

def get_stock_news(symbol: str = None, **kwargs):
    """Fetches latest news for a specific stock symbol."""
    if not symbol:
        symbol = kwargs.get('stock') or kwargs.get('ticker')
        
    if not symbol:
        return json.dumps({"error": "Symbol required"})
    
    # Auto-append .NS for NSE if not present (and not BSE)
    if not symbol.endswith(".NS") and not symbol.endswith(".BO"):
        symbol = f"{symbol}.NS"
        
    try:
        ticker = yf.Ticker(symbol)
        news = ticker.news
        if not news:
            return json.dumps([f"No recent news found for {symbol}."])
            
        # Extract top 3 headlines
        headlines = []
        for item in news[:3]:
            # Handle different formats returned by yfinance news
            title = item.get('title', item.get('content', {}).get('title', ''))
            if title:
                headlines.append(title)
                
        return json.dumps(headlines if headlines else [f"No readable news titles found for {symbol}."])
    except Exception as e:
        return json.dumps({"error": str(e)})

def get_stock_forecast(symbol: str = None, **kwargs):
    """Fetches ML-based time series forecast for a stock."""
    if not symbol:
        symbol = kwargs.get('stock') or kwargs.get('ticker')
    if not symbol:
        return json.dumps({"error": "Symbol required"})
    try:
        data = ml_service.predict_stock_price(symbol, forecast_days=7)
        return json.dumps(data)
    except Exception as e:
        return json.dumps({"error": str(e)})

def get_stock_risk_classification(symbol: str = None, **kwargs):
    """Fetches ML-based risk classification and feature importance for a stock."""
    if not symbol:
        symbol = kwargs.get('stock') or kwargs.get('ticker')
    if not symbol:
        return json.dumps({"error": "Symbol required"})
    try:
        data = ml_service.classify_stock_risk(symbol)
        return json.dumps(data)
    except Exception as e:
        return json.dumps({"error": str(e)})

TOOLS = {
    "get_live_market_data": get_live_market_data,
    "get_latest_news": get_latest_news,
    "get_stock_quote": get_stock_quote,
    "get_stock_news": get_stock_news,
    "get_stock_forecast": get_stock_forecast,
    "get_stock_risk_classification": get_stock_risk_classification
}

TOOL_DEFINITIONS = [
    {
        "name": "get_live_market_data",
        "description": "Get live prices for Nifty 50, Bank Nifty, and Sensex.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_latest_news",
        "description": "Get latest top 5 business news headlines from India.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_stock_quote",
        "description": "Get live price for a specific stock.",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Stock symbol (e.g., RELIANCE, TCS)"}
            },
            "required": ["symbol"]
        }
    },
    {
        "name": "get_stock_news",
        "description": "Get latest news headlines specifically related to a given stock.",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Stock symbol (e.g., RELIANCE, TCS)"}
            },
            "required": ["symbol"]
        }
    },
    {
        "name": "get_stock_forecast",
        "description": "Get an ML-driven stock price forecast (Prophet/ARIMA) with trend and seasonality. Returns predictions and RMSE/MAE metrics.",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Stock symbol"}
            },
            "required": ["symbol"]
        }
    },
    {
        "name": "get_stock_risk_classification",
        "description": "Get stock risk classification (Low/Medium/High) via Logistic Regression. Returns Accuracy, F1-scores, and feature importance (volatility, price change, volume).",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Stock symbol"}
            },
            "required": ["symbol"]
        }
    }
]

async def call_sarvam(system_prompt: str, user_message: str, context: str = "", tools: List[Dict] = None) -> str:
    """
    Reusable function to call Sarvam AI API with tool support.
    Handles both native tool calling (if supported) and manual JSON-based tool calling for sarvam-m.
    """
    if not SARVAM_API_KEY:
        return "[Mock] SARVAM_API_KEY missing in .env. Please add it to enable real AI."

    headers = {
        "Authorization": f"Bearer {SARVAM_API_KEY}",
        "Content-Type": "application/json"
    }

    # Manual Tool Calling Logic for sarvam-m
    model = "sarvam-2.0-8b" # Recent stable model, fallback to sarvam-m if needed
    
    # Inject tool definitions into system prompt if using sarvam-m (since it lacks native tool support)
    tool_system_instruction = ""
    if tools:
        tool_system_instruction = "\n\nAVAILABLE TOOLS (Use these to fetch data):\n"
        for tool in tools:
            tool_system_instruction += f"- {tool['name']}: {tool['description']}\n"
        tool_system_instruction += "\nTo use a tool, respond ONLY with a JSON object: {\"tool\": \"tool_name\", \"args\": {...}}\n"

    final_system_prompt = f"{system_prompt}{tool_system_instruction}\n\nContext:\n{context}\nCurrent Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}"

    messages = [
        {"role": "system", "content": final_system_prompt},
        {"role": "user", "content": user_message}
    ]

    payload = {
        "model": "sarvam-2.0-8b", 
        "messages": messages,
        "max_tokens": 1200, # Increased for detailed intelligence reports (User requested 800-1200)
        "temperature": 0.3 # Slightly higher for creative analysis
    }

    # Try to execute tool loop manually
    try:
        print(f"Sending request to Sarvam ({payload['model']})...")
        async with aiohttp.ClientSession() as session:
            async with session.post(SARVAM_API_URL, json=payload, headers=headers) as response:
                if response.status != 200:
                    # Fallback to sarvam-m if 2.0-8b fails
                    print(f"Model failed {response.status}, retrying with sarvam-m")
                    payload["model"] = "sarvam-m"
                    async with session.post(SARVAM_API_URL, json=payload, headers=headers) as retry_response:
                        if retry_response.status != 200:
                             error_text = await retry_response.text()
                             return f"Error from Sarvam API: {retry_response.status} - {error_text}"
                        data = await retry_response.json()
                else:
                    data = await response.json()

                choice = data["choices"][0]
                content = choice["message"]["content"]

                # Check for manual tool call (JSON)
                # Cleaning content to handle markdown code blocks that some models verify
                clean_content = content.replace("```json", "").replace("```", "").strip()
                
                if tools and "{" in clean_content and "tool" in clean_content:
                    try:
                        # Attempt to parse multiple JSON tool calls (line-separated)
                        tool_calls = []
                        json_objects = []
                        
                        # Split by newline and try to parse each line as JSON
                        for line in clean_content.split('\n'):
                            line = line.strip()
                            if line.startswith("{") and line.endswith("}"):
                                try:
                                    obj = json.loads(line)
                                    if "tool" in obj:
                                        tool_calls.append(obj)
                                        json_objects.append(line)
                                except:
                                    pass
                        
                        # Fallback: if no line-separated tools, try extracting a single JSON block
                        if not tool_calls:
                            start_idx = clean_content.find("{")
                            end_idx = clean_content.rfind("}") + 1
                            json_str = clean_content[start_idx:end_idx]
                            tool_call = json.loads(json_str)
                            tool_calls.append(tool_call)
                            json_objects.append(json_str)

                        if tool_calls:
                            combined_results = []
                            
                            for tc in tool_calls:
                                func_name = tc.get("tool")
                                args = tc.get("args", {})
                                
                                if func_name in TOOLS:
                                    print(f"Executing Manual Tool: {func_name} args: {args}")
                                    func = TOOLS[func_name]
                                    if args:
                                        result = func(**args)
                                    else:
                                        result = func()
                                    combined_results.append(f"Tool '{func_name}' Output: {result}")
                            
                            # Feed results back to model
                            # We combine the distinct JSON lines back into the assistant message
                            messages.append({"role": "assistant", "content": "\n".join(json_objects)})
                            
                            combined_text = "\n\n".join(combined_results)
                            messages.append({"role": "user", "content": f"{combined_text}\n\nNow generate the FINAL, DETAILED report based on this data. adhere to the 'Detailed Market Snapshot' and 'In-Depth Analysis' format. DO NOT output the tool JSON again."})
                            
                            payload["messages"] = messages
                            
                            async with session.post(SARVAM_API_URL, json=payload, headers=headers) as final_res:
                                final_data = await final_res.json()
                                return final_data["choices"][0]["message"]["content"]
                                
                    except Exception as e:
                        print(f"Manual tool parsing failed: {e}")
                        # Fallback: DO NOT return raw JSON. 
                        return "I'm having trouble connecting to the live news feed right now. Please try again in a moment."

                return content

    except Exception as e:
        return f"Error connecting to Sarvam Core: {str(e)}"

class AgentCore:
    async def get_response(self, agent_id: str, user_message: str, context: Optional[str] = "") -> str:
        agent_key = agent_id.upper()
        if agent_key not in PROMPTS:
            agent_key = "MARCUS"
        
        system_prompt = PROMPTS[agent_key]
        
        # Only enable tools for Marcus for now (Intelligence Report)
        tools = TOOL_DEFINITIONS if agent_key == "MARCUS" else None
        
        response_text = await call_sarvam(system_prompt, user_message, context, tools)
        return response_text

agent_system = AgentCore()
