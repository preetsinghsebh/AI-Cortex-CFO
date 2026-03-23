from fastapi import APIRouter, HTTPException
from app.agents.core import agent_system

router = APIRouter()

@router.get("/api/marcus/intelligence")
async def get_marcus_intelligence(agent: str = "MARCUS"):
    """
    Generates a live intelligence report using a specific Agent + Sarvam Tools.
    """
    try:
        # Specialized prompt to force tool usage
        prompt = (
            "GENERATE INTELLIGENCE REPORT.\n"
            "MANDATORY: You MUST use the provided tools (`get_live_market_data`, `get_latest_news`) to fetch real-time data. DO NOT HALLUCINATE DATA.\n"
            "CRITICAL: After using a tool, you must generate a natural language report. DO NOT output the tool JSON in your final response.\n"
            "LANGUAGE INSTRUCTION: If the user's input/context is in Hindi or Hinglish, generate the report in a mix of Hindi/English (Hinglish) with a witty Bollywood touch. Otherwise, use English.\n"
            "Format the response EXACTLY as follows:\n\n"
            "1. **IST Timestamp**: [Current Time]\n"
            "2. **Detailed Market Snapshot**:\n"
            "   - **Nifty**: [Price] ([% Change])\n"
            "   - **Sensex**: [Price] ([% Change])\n"
            "   - **Bank Nifty**: [Price] ([% Change])\n"
            "   - **India VIX**: [Price] ([% Change])\n"
            "3. **Top 5 Headlines**:\n"
            "   • **[Headline 1]**: [Brief explanation/context]\n"
            "   • **[Headline 2]**: [Brief explanation/context]\n"
            "   • **[Headline 3]**: [Brief explanation/context]\n"
            "   • **[Headline 4]**: [Brief explanation/context]\n"
            "   • **[Headline 5]**: [Brief explanation/context]\n"
            "   (Provide EXACTLY 5 headlines)\n"
            "4. **In-Depth Analysis**:\n"
            "   [Write a comprehensive paragraph (200-300 words). Analyze the market sentiment, valid reasons for moves, global cues, and what it means for a retail investor. Be witty but insightful.]\n"
            "5. **CFO Directive**: [Specific actionable advice for the user based on this data]\n\n"
            "DISCLAIMER: Educational purpose only. No investment advice.\n"
            "Use bolding for keys. Make it look professional and 'big'. This report is a static snapshot."
        )
        
        response = await agent_system.get_response(agent.upper(), prompt)
        return {"report": response}
    
    except Exception as e:
        print(f"Intelligence Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
