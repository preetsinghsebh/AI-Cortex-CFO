"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface MarketData {
    price: number
    change: number
}

interface PulseData {
    nifty: MarketData
    sensex: MarketData
    banknifty: MarketData
    indiavix: MarketData
}

export function MarketPulse() {
    const [data, setData] = useState<PulseData | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/market/pulse`)
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            console.error("Failed to fetch market pulse", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="h-24 w-full bg-zinc-900/50 animate-pulse rounded-xl" />

    const indices = [
        { name: "NIFTY 50", key: "nifty", icon: Activity },
        { name: "SENSEX", key: "sensex", icon: Activity },
        { name: "BANK NIFTY", key: "banknifty", icon: Activity },
        { name: "INDIA VIX", key: "indiavix", icon: Activity },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {indices.map((idx) => {
                const info = data ? data[idx.key as keyof PulseData] : { price: 0, change: 0 }
                const isPositive = info.change >= 0
                // VIX is usually inverse context, but let's keep standard green/red for now or maybe inverse?
                // Standard convention: Green is up.

                return (
                    <motion.div
                        key={idx.key}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:bg-white/5 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-zinc-400 text-xs font-bold tracking-wider uppercase">{idx.name}</span>
                            <idx.icon size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-white font-mono tracking-tight">
                                {info.price.toLocaleString("en-IN")}
                            </span>
                            <div className={`flex items-center text-xs font-bold mb-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                {info.change}%
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
