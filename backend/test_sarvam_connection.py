import asyncio
import os
from dotenv import load_dotenv
from app.agents.core import agent_system

load_dotenv()

async def test_sarvam_connection():
    print(f"Checking for SARVAM_API_KEY: {'[FOUND]' if os.getenv('SARVAM_API_KEY') else '[MISSING]'}")
    
    print("\nAttempting to contact 'Marcus' via Sarvam AI...")
    try:
        response = await agent_system.get_response("MARCUS", "Hello, are you running on Sarvam AI now?")
        print(f"\n[MARCUS]: {response}")
        
    except Exception as e:
        print(f"\n[ERROR]: Connection failed. {e}")

if __name__ == "__main__":
    asyncio.run(test_sarvam_connection())
