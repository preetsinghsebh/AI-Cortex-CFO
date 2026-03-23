"use client"

import { motion } from "framer-motion"
import { Activity, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemStatusBarProps {
    agent: "Marcus" | "Apex" | "Shield" | "Oracle"
    bias: "BULLISH" | "BEARISH" | "NEUTRAL"
    confidence: number
    state: "SCANNING" | "MONITORING" | "EXECUTING" | "IDLE"
}

export function SystemStatusBar({ agent, bias, confidence, state }: SystemStatusBarProps) {
    return (
        <div className="w-full flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/5 mb-6 gap-4 md:gap-0 relative overflow-hidden">

            {/* Ambient pulse */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-50" />

            {/* Left: Agent Status */}
            <div className="flex items-center gap-4 z-10">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse absolute -right-1 -top-1 border border-black shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 shadow-lg">
                        <Brain className="text-zinc-200" size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                        {agent === "Marcus" ? "MARCUS" : agent.toUpperCase()} <span className="text-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">ACTIVE</span>
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 uppercase tracking-wider">
                        <Activity size={10} className="text-emerald-500" /> System Online
                    </p>
                </div>
            </div>

            {/* Center: Market Bias */}
            <div className="flex items-center gap-8 px-8 py-2.5 rounded-full bg-black/40 border border-white/5 shadow-inner z-10">
                <div className="text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">MARKET BIAS</p>
                    <p className={cn(
                        "text-sm font-bold tracking-tight shadow-[0_0_10px_currentColor/30]",
                        bias === "BULLISH" ? "text-emerald-400" : bias === "BEARISH" ? "text-rose-400" : "text-yellow-400"
                    )}>
                        {bias}
                    </p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">CONFIDENCE</p>
                    <div className="flex items-end gap-1 justify-center">
                        <p className="text-lg font-bold text-white tracking-tighter font-mono">{confidence}%</p>
                    </div>
                </div>
            </div>

            {/* Right: System State */}
            <div className="flex items-center gap-3 z-10">
                <p className="text-xs text-emerald-400/80 font-mono uppercase tracking-wider">
                    {state === "SCANNING" ? "Scanning Global Sentiment" : `${state}...`}
                </p>
                <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="absolute w-2 h-2 bg-emerald-500 rounded-full" />
                    <motion.span
                        className="absolute w-full h-full border border-emerald-500 rounded-full opacity-0"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                        className="absolute w-full h-full border border-emerald-500 rounded-full opacity-0"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                </div>
            </div>
        </div>
    )
}
