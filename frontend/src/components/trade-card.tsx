"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TradeCardProps {
    symbol: string
    name: string
    type: "BUY" | "SELL"
    entry: string
    target: string
    stopLoss: string
    risk: "LOW" | "MEDIUM" | "HIGH"
    reasoning: string
    timeframe: string
    onExecute?: () => void
}

export function TradeCard({
    symbol,
    name,
    type,
    entry,
    target,
    stopLoss,
    risk,
    reasoning,
    timeframe,
    onExecute
}: TradeCardProps) {
    const isBuy = type === "BUY"
    const riskColor = risk === "LOW" ? "text-emerald-400" : risk === "MEDIUM" ? "text-yellow-400" : "text-red-400"
    const typeColor = isBuy ? "text-emerald-400" : "text-rose-400"
    const typeBg = isBuy ? "bg-emerald-500/10" : "bg-rose-500/10"
    const typeBorder = isBuy ? "border-emerald-500/20" : "border-rose-500/20"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="relative group w-full"
        >
            {/* Glowing Backdrop */}
            <div className={cn(
                "absolute -inset-0.5 rounded-3xl blur transition duration-500 opacity-0 group-hover:opacity-100",
                isBuy ? "bg-emerald-500/20" : "bg-rose-500/20"
            )} />

            <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-white tracking-tighter">{symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white tracking-wide">{symbol}</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">{name}</p>
                        </div>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-full border flex items-center gap-2", typeBg, typeBorder)}>
                        {isBuy ? <ArrowUpRight className={cn("w-4 h-4", typeColor)} /> : <ArrowDownRight className={cn("w-4 h-4", typeColor)} />}
                        <span className={cn("font-bold text-sm tracking-wider", typeColor)}>{type}</span>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">ENTRY</p>
                        <p className="font-mono text-white">{entry}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">TARGET</p>
                        <p className={cn("font-mono", isBuy ? "text-emerald-400" : "text-rose-400")}>{target}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">STOP</p>
                        <p className="font-mono text-zinc-400">{stopLoss}</p>
                    </div>
                </div>

                {/* Analysis */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Timeframe</span>
                        <span className="text-white font-medium">{timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Risk Profile</span>
                        <div className="flex items-center gap-2">
                            {risk === "LOW" && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                            {risk === "MEDIUM" && <TrendingUp className="w-4 h-4 text-yellow-400" />}
                            {risk === "HIGH" && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                            <span className={cn("font-bold", riskColor)}>{risk}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            <span className="text-emerald-500 mr-2">{"/// AI INSIGHT:"}</span>
                            {reasoning}
                        </p>
                    </div>
                </div>

                {/* Action */}
                <Button
                    onClick={onExecute}
                    className={cn(
                        "w-full h-12 rounded-xl text-lg font-bold tracking-wide transition-all transform active:scale-95 group-hover:shadow-lg",
                        isBuy
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                            : "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20"
                    )}
                >
                    <Zap className="w-5 h-5 mr-2 fill-current" /> EXECUTE TRADE
                </Button>
            </div>
        </motion.div>
    )
}
