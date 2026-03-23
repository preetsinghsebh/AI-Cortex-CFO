const API_URL = "http://127.0.0.1:8000";

export async function sendChatMessage(message: string, history: any[], agent_id: string = "marcus") {
    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, history, agent_id }),
        });

        if (!res.ok) throw new Error("Netork response was not ok");
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { response: "I'm having trouble connecting to my neural core. Please try again." };
    }
}

export async function getMarketStatus() {
    // Mock data for now, will connect to real API later
    return {
        nifty: { price: "24,850.45", change: "+1.2%", sentiment: "Bullish" },
        sensex: { price: "81,400.00", change: "+0.8%", sentiment: "Bullish" },
    };
}
