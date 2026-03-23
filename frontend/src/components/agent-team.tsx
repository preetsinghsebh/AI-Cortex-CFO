"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, TrendingUp, Shield, Zap, LineChart, Sparkles, BrainCircuit } from "lucide-react"
import { useAgent } from "@/context/agent-context"
// import { useRouter } from "next/navigation" // Removed as it's not used in the new code

const specializedAgents = [
    {
        id: "apex",
        name: "Apex Predator",
        role: "High-Risk / Momentum",
        desc: "Hunts for aggressive breakouts and volatility plays.",
        icon: <Zap className="w-6 h-6 text-orange-100" />,
        gradient: "from-orange-500 to-red-600",
    },
    {
        id: "warren",
        name: "Warren 2.0",
        role: "Value Investing",
        desc: "Focuses on fundamentals, moats, and long-term compounding.",
        icon: <TrendingUp className="w-6 h-6 text-blue-100" />,
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        id: "shield",
        name: "Shield",
        role: "Risk Management",
        desc: "Monitors downside risk and suggests hedges to protect capital.",
        icon: <Shield className="w-6 h-6 text-emerald-100" />,
        gradient: "from-green-600 to-emerald-800",
    },
]

export function AgentTeam() {
    const { setAgent } = useAgent()
    // const useRouterHook = useRouter() // Rename to avoid conflict if I used useRouter directly

    // Fix: useRouter is imported but let's just use window.scrollTo or assume ChatOrb handles it?
    // Actually, in the main page, we don't need to push to "/" since we are already there.
    // We just need to open the orb. But the Orb state is internal to the Orb... 
    // For now, let's just set the agent. The user can then click the orb.

    const handleActivate = (agentId: any) => {
        setAgent(agentId)
        // Ideally we would open the orb here. For now, let's just set the agent.
        // A toast or visual feedback would be nice.
    }

    return (
        <section className="py-24 container mx-auto px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black pointer-events-none" />

            {/* MARCUS - The Leader (Merged Header) */}
            <div className="relative z-10 max-w-4xl mx-auto mb-24 text-center">
                <div className="flex flex-col items-center justify-center gap-8">

                    <div>
                        <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase mb-6 block">Neural Architecture</span>
                        <h2 className="font-serif text-6xl md:text-7xl text-white mb-8">Select Your Intelligence</h2>
                        <p className="text-zinc-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            "I am <span className="text-white font-medium">Marcus</span>. Tell me your goals, and I will select the best agent to handle your specific financial needs."
                        </p>
                    </div>

                    <div className="w-full max-w-2xl relative group mt-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all group-focus-within:border-emerald-500/50 group-focus-within:ring-1 group-focus-within:ring-emerald-500/20">
                            <Bot className="ml-4 w-6 h-6 text-emerald-500" />
                            <input
                                type="text"
                                placeholder="Describe your goals here..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-500 px-4 py-4 text-lg outline-none"
                                onFocus={() => handleActivate('marcus')}
                            />
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center transition-all"
                                onClick={() => handleActivate('marcus')}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialized Agents Grid */}
            <div className="flex flex-wrap justify-center gap-6 relative z-10 max-w-6xl mx-auto">
                {specializedAgents.map((agent, i) => (
                    <div
                        key={i}
                        className="group relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-1 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]"
                    >  <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />

                        <div className="relative h-full bg-zinc-950/80 backdrop-blur-md rounded-[23px] p-6 flex flex-col items-start border border-white/5">

                            <div className="flex items-center gap-4 mb-4 w-full">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${agent.gradient} shadow-lg`}>
                                    {agent.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif text-xl font-medium text-white">{agent.name}</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{agent.role}</p>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                                {agent.desc}
                            </p>

                            <Button
                                variant="ghost"
                                className="w-full text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 justify-between group-hover:border-white/20"
                                onClick={() => handleActivate(agent.id)}
                            >
                                <span className="text-xs uppercase tracking-widest">Initialize</span>
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
