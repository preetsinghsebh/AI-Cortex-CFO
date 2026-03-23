"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Briefcase, ShieldCheck, BrainCircuit } from "lucide-react"
import { MarcusIntelligence } from "@/components/dashboard/marcus-intelligence"
import { MarketPulse } from "@/components/dashboard/market-pulse"
import { SignalCard } from "@/components/dashboard/signal-card"
import { useAgent } from "@/context/agent-context"
import { useChat } from "@/context/chat-context"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
    const { currentAgent, setAgent } = useAgent()
    const { addMessage } = useChat()

    const [portfolio, setPortfolio] = useState<any>(null)
    const [signals, setSignals] = useState<any[]>([])
    const [loadingSignals, setLoadingSignals] = useState(true)

    // Fetch Portfolio Data
    const fetchPortfolio = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/portfolio")
            if (res.ok) {
                const data = await res.json()
                setPortfolio(data)
            }
        } catch (error) {
            console.error("Failed to fetch portfolio", error)
        }
    }

    // Fetch Signals
    const fetchSignals = async () => {
        setLoadingSignals(true)
        try {
            const res = await fetch("http://localhost:8000/api/signals")
            if (res.ok) {
                const data = await res.json()
                setSignals(data)
            }
        } catch (error) {
            console.error("Failed to fetch signals", error)
        } finally {
            setLoadingSignals(false)
        }
    }

    useEffect(() => {
        fetchPortfolio()
        fetchSignals()
        const portInterval = setInterval(fetchPortfolio, 10000)
        return () => clearInterval(portInterval)
    }, [])

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* SECTION 1: MARKET PULSE */}
            <div className="mb-6 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-serif font-bold tracking-tight text-white">India Market Pulse</h2>
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        MARKET OPEN
                    </div>
                </div>
                <MarketPulse />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pb-32 scrollbar-hide grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">

                {/* LEFT COLUMN (2/3) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* SECTION: SIGNALS */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-serif font-bold tracking-tight text-white">High-Conviction Signals</h2>
                            <button onClick={fetchSignals} className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 transition-colors">
                                <RefreshCw size={14} className={loadingSignals ? "animate-spin" : ""} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {signals.map((signal, idx) => (
                                <SignalCard
                                    key={idx}
                                    {...signal}
                                    onExecute={() => {
                                        addMessage({
                                            role: "user",
                                            content: `Execute trade: ${signal.type} ${signal.symbol} at ${signal.entry}`
                                        })
                                    }}
                                />
                            ))}
                            {signals.length === 0 && !loadingSignals && (
                                <div className="col-span-2 p-12 border border-dashed border-white/5 rounded-3xl text-center">
                                    <p className="text-zinc-500 text-sm italic">Scanning markets for alpha...</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SECTION 3: MARCUS INTELLIGENCE */}
                    <MarcusIntelligence />
                </div>

                {/* RIGHT COLUMN (1/3) - SECTION 5 & AGENTS */}
                <div className="space-y-6">

                    {/* PORTFOLIO SNAPSHOT */}
                    <div className="glass-card rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Briefcase size={14} /> Portfolio (INR)
                        </h3>
                        <div className="mb-6">
                            <p className="text-zinc-500 text-xs mb-1">Net Liquidation Value</p>
                            <p className="text-3xl font-bold text-white font-mono">
                                ₹{portfolio ? portfolio.balance.toLocaleString("en-IN") : "..."}
                            </p>
                            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                                <TrendingUp size={12} /> +2.4% Today
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-zinc-400">Cash Available</span>
                                <span className="text-white font-mono">₹4,50,000</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-zinc-400">Equity Exposure</span>
                                <span className="text-white font-mono">65%</span>
                            </div>
                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                <p className="text-rose-400 text-xs font-bold flex items-center gap-2">
                                    <ShieldCheck size={12} /> Risk Alert
                                </p>
                                <p className="text-zinc-300 text-xs mt-1">Overweight in Banking (40%). Rebalance suggested.</p>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE AGENTS */}
                    <div className="glass-card rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit size={14} /> Active CFO Agents
                        </h3>
                        <div className="space-y-3">
                            <AgentStatus
                                name="Marcus"
                                role="Chief Investment Officer"
                                color="bg-emerald-500"
                                active={currentAgent === "marcus"}
                                onClick={() => setAgent("marcus")}
                            />
                            <AgentStatus
                                name="Apex Predator"
                                role="Alpha Hunter"
                                color="bg-orange-500"
                                active={currentAgent === "apex"}
                                onClick={() => setAgent("apex")}
                            />
                            <AgentStatus
                                name="Shield"
                                role="Risk Manager"
                                color="bg-blue-500"
                                active={currentAgent === "shield"}
                                onClick={() => setAgent("shield")}
                            />
                            <AgentStatus
                                name="Oracle"
                                role="Macro Strategist"
                                color="bg-purple-500"
                                active={currentAgent === "oracle"}
                                onClick={() => setAgent("oracle")}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function AgentStatus({ name, role, status, color, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${active
                ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-transparent border-white/5 hover:bg-white/5'
                }`}
        >
            <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
            <div className="flex-1">
                <p className={`text-sm font-bold transition-colors ${active ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                    {name}
                </p>
                <p className="text-xs text-zinc-500">{role}</p>
            </div>
            {active && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">ON</span>}
        </div>
    )
}
