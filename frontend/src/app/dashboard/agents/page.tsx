"use client"

import { Bot, Shield, Zap, Target, BrainCircuit, Activity } from "lucide-react"

const agents = [
    { name: "Marcus", role: "Market Intelligence", desc: "Analyzes global sentiment and macro trends.", status: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Apex", role: "Trade Execution", desc: "Optimizes entry and exit points for max alpha.", status: "Paused", color: "text-amber-400", bg: "bg-amber-500/10" },
    { name: "Shield", role: "Risk Assessment", desc: "Monitors portfolio volatility and drawdown.", status: "Active", color: "text-rose-400", bg: "bg-rose-500/10" },
    { name: "Oracle", role: "Forecasting", desc: "Predicts future price action using Prophet models.", status: "Active", color: "text-indigo-400", bg: "bg-indigo-500/10" }
]

export default function AgentsPage() {
    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2 className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
                    <Bot className="text-indigo-400" /> Neural Processors
                </h2>
                <p className="text-sm text-zinc-500">Manage and monitor your AI agent swarm.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                    <div key={agent.name} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${agent.bg} blur-3xl rounded-full -mr-12 -mt-12 transition-all group-hover:blur-2xl`} />
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${agent.bg} flex items-center justify-center ${agent.color} mb-6`}>
                                <BrainCircuit size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${agent.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                {agent.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">{agent.role}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                            {agent.desc}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <Activity size={14} className="text-zinc-600" /> Latency: 42ms | Uptime: 99.9%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
