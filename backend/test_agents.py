import asyncio
import os
from dotenv import load_dotenv
from app.agents.core import agent_system

load_dotenv()

async def test_agents():
    agents = ["MARCUS", "APEX", "WARREN", "SHIELD", "ORACLE"]
    
    print("--- Testing Specialized Agents (Sarvam Powered) ---")
    
    for agent_id in agents:
        print(f"\nTesting {agent_id}...")
        try:
            # agent_system.get_response(agent_id, user_message, context)
            response = await agent_system.get_response(agent_id, "What do you think about the market today?")
            print(f"[{agent_id}]: {response[:100]}...") # Print first 100 chars
        except Exception as e:
            print(f"[{agent_id}] Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_agents())
