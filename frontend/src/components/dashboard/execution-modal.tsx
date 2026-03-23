"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle2, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExecutionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (isLive: boolean) => void
    tradeDetails: {
        symbol: string
        type: "BUY" | "SELL"
        entry: string
        quantity: number
        totalValue: string
        risk: string
    } | null
}

export function ExecutionModal({ isOpen, onClose, onConfirm, tradeDetails }: ExecutionModalProps) {
    const [isLive, setIsLive] = useState(false)

    if (!tradeDetails) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="text-yellow-500" size={20} />
                                    Confirm Execution
                                </h2>
                                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Toggle Live/Paper */}
                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                    <button
                                        onClick={() => setIsLive(false)}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                                            !isLive ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        PAPER TRADE
                                    </button>
                                    <button
                                        onClick={() => setIsLive(true)}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                                            isLive ? "bg-red-500/20 text-red-500 border border-red-500/50" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        LIVE MARKET
                                    </button>
                                </div>

                                {/* Trade Summary */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Asset</span>
                                        <span className="text-xl font-bold text-white">{tradeDetails.symbol}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Action</span>
                                        <span className={cn(
                                            "font-bold px-2 py-0.5 rounded text-xs",
                                            tradeDetails.type === "BUY" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                                        )}>
                                            {tradeDetails.type}
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Entry Price</span>
                                        <span className="font-mono text-white">{tradeDetails.entry}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Est. Total</span>
                                        <span className="font-mono text-white">{tradeDetails.totalValue}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Risk Level</span>
                                        <span className="font-bold text-yellow-500">{tradeDetails.risk}</span>
                                    </div>
                                </div>

                                {/* Warning */}
                                {isLive && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 leading-relaxed">
                                        <strong>Warning:</strong> You are about to execute a live transaction with real capital. Slippage may occur.
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
                                <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 hover:bg-white/10 text-white">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => onConfirm(isLive)}
                                    className={cn(
                                        "flex-1 font-bold",
                                        isLive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600 text-black"
                                    )}
                                >
                                    {isLive ? "Confirm Live Trade" : "Confirm Paper Trade"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
