"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, ShieldAlert, Target, Zap, Activity, BarChart2, MessageSquare, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DecodingText } from "@/components/ui/decoding-text"

interface SignalCardProps {
    symbol: string
    name: string
    type: "BUY" | "SELL"
    entry: string
    target: string
    stopLoss: string
    timeframe: string
    risk: "LOW" | "MEDIUM" | "HIGH"
    confidence: number
    reasoning: {
        technical: string
        sentiment: string
        volume: string
        riskFactors: string
    }
    onExecute: () => void
}

export function SignalCard({
    symbol, name, type, entry, target, stopLoss, timeframe, risk, confidence, reasoning, onExecute
}: SignalCardProps) {
    const [expanded, setExpanded] = useState(false)
    const isBuy = type === "BUY"

    const typeColor = isBuy ? "text-emerald-400" : "text-rose-400"
    const typeBg = isBuy ? "bg-emerald-500/10" : "bg-rose-500/10"
    const typeBorder = isBuy ? "border-emerald-500/20" : "border-rose-500/20"
    const riskColor = risk === "LOW" ? "text-emerald-400" : risk === "MEDIUM" ? "text-yellow-400" : "text-rose-400"

    const [livePrice, setLivePrice] = useState<string | null>(null)

    // Fetch live price on mount
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/quote/${symbol.split('/')[0]}`)
                if (res.ok) {
                    const data = await res.json()
                    setLivePrice(data.price.toFixed(2))
                }
            } catch (e) {
                console.error("Price fetch error:", e)
            }
        }
        fetchPrice()
        const interval = setInterval(fetchPrice, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [symbol])

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group w-full"
        >
            <div className="relative flex flex-col rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300 overflow-hidden">

                {/* Top Stripe (Confidence) */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent w-[74%]" style={{ width: `${confidence}%` }} />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                                <span className="font-bold text-white tracking-tighter text-lg">{symbol.split('/')[0].slice(0, 2)}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white tracking-wide flex items-center gap-2">
                                    {symbol}
                                    {livePrice && (
                                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                            ${livePrice}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{name}</p>
                            </div>
                        </div>
                        <div className={cn("px-3 py-1 rounded-lg border flex items-center gap-2", typeBg, typeBorder)}>
                            {isBuy ? <ArrowUpRight className={cn("w-4 h-4", typeColor)} /> : <ArrowDownRight className={cn("w-4 h-4", typeColor)} />}
                            <span className={cn("font-bold text-sm tracking-wider", typeColor)}>{type}</span>
                        </div>
                    </div>

                    {/* Primary Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <StatBox label="ENTRY" value={entry} />
                        <StatBox label="TARGET" value={target} highlight={isBuy ? "text-emerald-400" : "text-rose-400"} />
                        <StatBox label="STOP" value={stopLoss} highlight="text-zinc-400" />
                    </div>

                    {/* Secondary Data & Confidence */}
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">TIMEFRAME</span>
                            <span className="text-sm font-medium text-zinc-300 font-mono tracking-tight">{timeframe}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">CONFIDENCE</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${confidence}%` }} />
                                </div>
                                <span className="text-sm font-bold text-white font-mono">{confidence}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={onExecute}
                        className={cn(
                            "w-full h-11 rounded-xl text-sm font-bold tracking-wide transition-all transform active:scale-95 group-hover:shadow-lg mb-3",
                            isBuy
                                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                                : "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20"
                        )}
                    >
                        <Zap className="w-4 h-4 mr-2 fill-current" /> EXECUTE
                    </Button>

                    {/* Why This Trade Toggle */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors pt-2 border-t border-white/5"
                    >
                        {expanded ? "Hide Analysis" : "Why This Trade?"}
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* Expanded Analysis */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20 border-t border-white/5"
                        >
                            <div className="p-5 space-y-4">
                                <ReasoningItem label="TECHNICAL" icon={<Activity size={12} />} text={reasoning.technical} />
                                <ReasoningItem label="SENTIMENT" icon={<MessageSquare size={12} />} text={reasoning.sentiment} />
                                <ReasoningItem label="VOLUME" icon={<BarChart2 size={12} />} text={reasoning.volume} />
                                <ReasoningItem label="RISK FACTORS" icon={<ShieldAlert size={12} />} text={reasoning.riskFactors} isRisk />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

function StatBox({ label, value, highlight = "text-white" }: { label: string, value: string, highlight?: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center relative overflow-hidden">
            {/* Mini sparkline effect background */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10 bg-gradient-to-t from-current to-transparent pointer-events-none" />

            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 relative z-10">{label}</p>
            <p className={cn("text-lg font-mono font-bold tracking-tighter relative z-10", highlight)}>{value}</p>
        </div>
    )
}

function ReasoningItem({ label, text, icon, isRisk = false }: { label: string, text: string, icon: any, isRisk?: boolean }) {
    return (
        <div className="text-xs">
            <div className="flex items-center gap-2 mb-1 text-zinc-400 font-bold uppercase tracking-wider font-mono text-[10px]">
                {icon} {label}
            </div>
            <p className={cn("leading-relaxed opacity-90", isRisk ? "text-rose-200" : "text-zinc-300")}>
                <DecodingText text={text} speed={10} />
            </p>
        </div>
    )
}
