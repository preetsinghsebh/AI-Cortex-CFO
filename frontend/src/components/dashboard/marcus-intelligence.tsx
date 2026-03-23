"use client"

import { useState, useEffect } from "react"
import { Bot, RefreshCw, Activity, Zap, TrendingUp, Shield, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAgent } from "@/context/agent-context"

export function MarcusIntelligence() {
    const { currentAgent } = useAgent()
    const [report, setReport] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchIntelligence = async () => {
        setLoading(true)
        setError(false)
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const url = `${apiUrl}/api/marcus/intelligence?agent=${currentAgent || 'marcus'}`
            const res = await fetch(url)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setReport(data.report)
            setLastUpdated(new Date())
        } catch (err) {
            console.error(err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIntelligence()
    }, [currentAgent])

    // Function to parse markdown-like bold syntax to HTML and color code percentages
    const formatText = (text: string): string[] => {
        let safeText = text || ""

        // Remove any JSON-like lines (tool calls) from the start
        safeText = safeText.replace(/^\{.*\}\s*$/gm, '').trim();

        return safeText
            .replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>') // Bold text is white
            .replace(/(\+\d+\.?\d*\%)/g, '<span class="text-emerald-400 font-bold">$1</span>') // Positive % in Green
            .replace(/(\-\d+\.?\d*\%)/g, '<span class="text-rose-400 font-bold">$1</span>') // Negative % in Red
            .replace(/^\* /gm, '• ')
            .split('\n').filter((line: string) => line.trim() !== '')
    }

    return (
        <div className="w-full glass-card rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        {currentAgent === 'apex' ? <TrendingUp size={16} className="text-orange-500" /> :
                            currentAgent === 'shield' ? <Shield size={16} className="text-blue-500" /> :
                                currentAgent === 'oracle' ? <Sparkles size={16} className="text-purple-500" /> :
                                    <Bot size={16} className="text-emerald-500" />
                        }
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 uppercase">
                            {currentAgent || 'MARCUS'} INTELLIGENCE
                            {loading && <span className="text-[10px] text-emerald-500 font-mono animate-pulse">UPDATING...</span>}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                            {currentAgent === 'apex' ? 'Momentum Scanners Active' :
                                currentAgent === 'shield' ? 'Risk Perimeter Monitored' :
                                    currentAgent === 'oracle' ? 'Macro Wave Theory Analysis' :
                                        'Live Nifty/Sensex Feed • Sarvam AI Core'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {lastUpdated && !loading && (
                        <span className="text-[10px] text-zinc-600 font-mono">
                            {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={fetchIntelligence}
                        disabled={loading}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors disabled:opacity-50"
                        title="Refresh Intelligence"
                    >
                        <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 min-h-[160px] relative">
                <AnimatePresence mode="wait">
                    {loading && !report ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center flex-col gap-3"
                        >
                            <Zap className="text-emerald-500 animate-pulse" size={24} />
                            <p className="text-xs text-zinc-500 font-mono">ESTABLISHING NEURAL LINK...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <Activity className="text-rose-500 mx-auto mb-2" size={24} />
                            <p className="text-sm text-zinc-400">Intelligence Upgrade Failed.</p>
                            <button onClick={fetchIntelligence} className="text-xs text-emerald-500 mt-2 hover:underline">Retry Connection</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {report && formatText(report).map((line, i) => (
                                <p
                                    key={i}
                                    className="text-sm text-zinc-300 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                                />
                            ))}

                            <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">EDUCATIONAL ONLY</span>
                                <span className="text-[10px] text-zinc-600 font-mono">SARVAM-2B MODEL</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
