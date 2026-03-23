"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, TrendingUp, Shield, Zap, LineChart } from "lucide-react"
import { useAgent } from "@/context/agent-context"
import { useRouter } from "next/navigation"

const agents = [
    {
        id: "marcus",
        name: "Marcus",
        role: "Chief Financial Officer",
        desc: "Your primary point of contact. Marcus synthesizes all agent data into clear, actionable advice.",
        icon: <Bot className="w-12 h-12 text-zinc-800" />,
        bg: "bg-zinc-100"
    },
    {
        id: "apex",
        name: "Apex Predator",
        role: "High-Risk / Momentum",
        desc: "Hunts for aggressive breakouts and volatility plays. High risk, high reward.",
        icon: <Zap className="w-12 h-12 text-orange-600" />,
        bg: "bg-orange-50"
    },
    {
        id: "warren",
        name: "Warren 2.0",
        role: "Value Investing",
        desc: "Focuses on fundamentals, moats, and long-term compounding. The safe bet.",
        icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
        bg: "bg-blue-50"
    },
    {
        id: "shield",
        name: "Shield",
        role: "Risk Management",
        desc: "Constantly monitors for downside risk and suggests hedges to protect capital.",
        icon: <Shield className="w-12 h-12 text-emerald-600" />,
        bg: "bg-emerald-50"
    },
    {
        id: "memelord",
        name: "Meme Lord",
        role: "Social Sentiment",
        desc: "Scrapes Reddit/Twitter for hype trains. Only for the brave.",
        icon: <LineChart className="w-12 h-12 text-purple-600" />,
        bg: "bg-purple-50"
    },
    {
        id: "oracle",
        name: "Oracle",
        role: "Market Prediction",
        desc: "Neutral market prediction engine based on technicals and macros.",
        icon: <Bot className="w-12 h-12 text-cyan-600" />,
        bg: "bg-cyan-50"
    }
]

export default function AgentsPage() {
    const { setAgent } = useAgent()
    const router = useRouter()

    const handleActivate = (agentId: any) => {
        setAgent(agentId)
        router.push("/") // Go back to dashboard/home where the orb is
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-black font-sans pt-20">
            <Navbar />

            <section className="py-20 container mx-auto px-4 text-center">
                <h1 className="font-serif text-5xl md:text-6xl mb-6">Meet Your Neural Team</h1>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-16">
                    Unlike other platforms, CortexCFO isn't just a chatbot. It's a squad of specialized agents working in harmony.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {agents.map((agent, i) => (
                        <div key={i} className={`rounded-3xl p-8 border border-black/5 ${agent.bg} hover:shadow-lg transition-all hover:-translate-y-1`}>
                            <div className="mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-xs">
                                {agent.icon}
                            </div>
                            <Badge variant="outline" className="mb-4 bg-white/50">{agent.role}</Badge>
                            <h3 className="font-serif text-2xl font-bold mb-3">{agent.name}</h3>
                            <p className="text-zinc-600 mb-8 leading-relaxed">
                                {agent.desc}
                            </p>
                            <Button
                                variant="outline"
                                className="w-full bg-white hover:bg-white/80 border-black/10 text-black"
                                onClick={() => handleActivate(agent.id)}
                            >
                                Chat with {agent.name.split(' ')[0]} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    )
}
