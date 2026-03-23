from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.agents.core import agent_system

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []
    agent_id: Optional[str] = "marcus"
    context: Optional[str] = ""

@router.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Get response from the unified agent system
        response_text = await agent_system.get_response(
            agent_id=request.agent_id,
            user_message=request.message,
            context=request.context
        )
        
        return {
            "response": response_text,
            "agent_id": request.agent_id,
            "status": "success"
        }
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
