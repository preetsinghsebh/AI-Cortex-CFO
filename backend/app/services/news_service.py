import feedparser
import asyncio
from typing import List, Dict

# Indian Financial News RSS Feeds
RSS_FEEDS = [
    "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", # ET Markets
    "https://www.moneycontrol.com/rss/latestnews.xml", # MoneyControl
    "https://www.livemint.com/rss/markets", # Mint Markets
]

class NewsService:
    async def get_latest_headlines(self, limit: int = 10) -> List[dict]:
        headlines = []
        try:
            # Fetching from the first feed for MVP speed
            # In production, we'd use a threadpool or aiohttp to fetch parallel
            feed = feedparser.parse(RSS_FEEDS[0]) 
            
            for entry in feed.entries[:limit]:
                headlines.append({
                    "title": entry.title,
                    "source": "Economic Times", 
                    "link": entry.link,
                    "timestamp": entry.published if 'published' in entry else ""
                })
                
            if not headlines:
                raise Exception("No headlines found")
                
            return headlines
        except Exception as e:
            # print(f"News fetch error: {e}") 
            # Fallback mock data if feedparser fails or no internet
            return [
                {"title": "Sensex surges 500 points on global cues (Mock)", "source": "Cortex Backup"},
                {"title": "Nifty IT index rallies led by TCS and Infy (Mock)", "source": "Cortex Backup"},
                {"title": "RBI keeps repo rate unchanged at 6.5% (Mock)", "source": "Cortex Backup"},
                {"title": "Gold prices hit fresh record high (Mock)", "source": "Cortex Backup"},
            ]

news_service = NewsService()
