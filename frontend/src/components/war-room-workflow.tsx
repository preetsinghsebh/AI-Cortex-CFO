"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Terminal, Activity, Shield, TrendingUp, Zap, Lock } from "lucide-react"

// Types for our simulation
type Agent = "MARCUS" | "WARREN" | "SHIELD" | "APEX"
type LogType = "INFO" | "ANALYSIS" | "WARNING" | "EXECUTION"

interface LogEntry {
    id: string
    timestamp: string
    agent: Agent
    type: LogType
    message: string
}

const AGENT_COLORS: Record<string, string> = {
    MARCUS: "text-blue-400",
    WARREN: "text-emerald-400",
    SHIELD: "text-amber-400",
    APEX: "text-rose-400"
}

// Simulated scenario data
const SCENARIO_LOGS = [
    { agent: "MARCUS", type: "INFO", message: "Scanning NSE data feeds... 24,000 datapoints/sec." },
    { agent: "MARCUS", type: "ANALYSIS", message: "Detected volume spike in HDFC Bank. +15% above moving average." },
    { agent: "WARREN", type: "ANALYSIS", message: "Cross-referencing with Q3 earnings report. Fundamentals strong." },
    { agent: "WARREN", type: "INFO", message: "RSI indicating oversold territory (32.5). Value opportunity identified." },
    { agent: "SHIELD", type: "WARNING", message: "Market volatility index (VIX) is elevated at 18.2." },
    { agent: "SHIELD", type: "ANALYSIS", message: "Calculating risk-adjusted position size. Capping exposure to 2.5%." },
    { agent: "APEX", type: "EXECUTION", message: "Strategy finalized. Executing LIMIT BUY @ 1450.00." },
    { agent: "APEX", type: "INFO", message: "Order filled. 500 units. Awaiting exit signal." },
]

export function WarRoomWorkflow() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [actionState, setActionState] = useState<"IDLE" | "ANALYZING" | "EXECUTING">("IDLE")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Simulation Loop
    useEffect(() => {
        let timeout: NodeJS.Timeout

        const processStep = () => {
            if (currentStep >= SCENARIO_LOGS.length) {
                // Reset simulation after a pause
                timeout = setTimeout(() => {
                    setLogs([])
                    setCurrentStep(0)
                    setActionState("IDLE")
                }, 5000)
                return
            }

            const stepData = SCENARIO_LOGS[currentStep]
            const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
            const newLog: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: timestamp,
                agent: stepData.agent as Agent,
                type: stepData.type as LogType,
                message: stepData.message
            }

            // Using functional update to access latest state correctly if needed,
            // though here we are relying on logs dependency not being in the effect dep array 
            // for the interval loop logic if we were using setInterval.
            // With recursive setTimeout driven by currentStep, we are fine.
            setLogs(prev => [...prev.slice(-6), newLog]) // Keep last 7 logs

            // Update Action State based on agent
            if (stepData.agent === "MARCUS" || stepData.agent === "WARREN") setActionState("ANALYZING")
            if (stepData.agent === "APEX") setActionState("EXECUTING")

            // Varying typing speed
            const delay = Math.random() * 800 + 400
            timeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, delay)
        }

        processStep()
        return () => clearTimeout(timeout)
    }, [currentStep])

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* LEFT: Text Content */}
                    <div className="lg:w-1/3">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Live Operation</span>
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            The Neural <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
                                War Room.
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                            Watch the hive mind at work. Every trade is the result of a rigorous debate between specialized AI agents—analyzing, validating, and executing in milliseconds.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-emerald-400 font-bold text-2xl mb-1">24/7</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">Uptime</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-blue-400 font-bold text-2xl mb-1">50ms</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">Latency</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Terminal Interface */}
                    <div className="lg:w-2/3 w-full">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl h-[500px] flex flex-col">
                            {/* Terminal Header */}
                            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                                    <Lock size={10} />
                                    CORTEX_KERNEL_V4.2.0
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                                {/* LOGS PANEL */}
                                <div className="flex-1 p-6 font-mono text-xs md:text-sm overflow-hidden flex flex-col relative border-b md:border-b-0 md:border-r border-white/10 bg-black/40">
                                    <div className="absolute top-0 left-0 w-full h-8 bg-linear-to-b from-black/20 to-transparent z-10" />

                                    <div ref={scrollRef} className="overflow-y-auto flex-1 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        <AnimatePresence mode="popLayout">
                                            {logs.map((log) => (
                                                <motion.div
                                                    key={log.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    layout
                                                    className="flex gap-3"
                                                >
                                                    <span className="text-zinc-600 shrink-0 select-none hidden sm:block">{log.timestamp}</span>
                                                    <div className="flex-1 wrap-break-word">
                                                        <span className={`font-bold ${AGENT_COLORS[log.agent]} mr-2`}>
                                                            [{log.agent}]
                                                        </span>
                                                        <span className="text-zinc-300">
                                                            {log.message}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {/* Typing Cursor */}
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="w-2 h-4 bg-emerald-500/50 mt-2"
                                        />
                                    </div>
                                </div>

                                {/* ACTION VISUALIZER PANEL */}
                                <div className="w-full md:w-1/3 bg-black/20 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[200px] md:min-h-full border-t border-white/10 md:border-t-0">
                                    {/* Scan Lines Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-size-[100%_4px,6px_100%]" />

                                    <AnimatePresence mode="wait">
                                        {actionState === "IDLE" && (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex flex-col items-center text-zinc-500"
                                            >
                                                <Terminal size={48} className="mb-4 opacity-50" />
                                                <span className="text-xs uppercase tracking-widest">System Standby</span>
                                            </motion.div>
                                        )}

                                        {actionState === "ANALYZING" && (
                                            <motion.div
                                                key="analyzing"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="flex flex-col items-center text-blue-400"
                                            >
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                                    <Activity size={48} className="relative z-10" />
                                                </div>
                                                <span className="text-xs uppercase tracking-widest font-bold animate-pulse">Analyzing Pattern</span>
                                            </motion.div>
                                        )}

                                        {actionState === "EXECUTING" && (
                                            <motion.div
                                                key="executing"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="w-full"
                                            >
                                                <Card className="bg-emerald-500/10 border-emerald-500/30 p-4 relative overflow-hidden backdrop-blur-md">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-[loading_2s_ease-in-out]" />
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Order Filled</span>
                                                        <Zap size={14} className="text-emerald-400" />
                                                    </div>
                                                    <div className="text-3xl font-bold text-white mb-2">HDFC</div>
                                                    <div className="flex justify-between items-end border-t border-white/10 pt-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-zinc-500 uppercase">Price</span>
                                                            <span className="text-sm font-mono text-white">1450.00</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-zinc-500 uppercase">Qty</span>
                                                            <span className="text-sm font-mono text-white">500</span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
