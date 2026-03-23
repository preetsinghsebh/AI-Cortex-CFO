"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react"

interface SectorData {
    name: string
    symbol: string
    price: number
    change: number
    percentChange: number
    volume: number
}

export function SectorPerformanceChart() {
    const [sectors, setSectors] = useState<SectorData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/market/sectors`)
                const data = await res.json()
                setSectors(data.sectors)
            } catch (error) {
                console.error("Failed to fetch sector data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSectors()
    }, [])

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center text-zinc-500 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm font-mono">Scanning Sectors...</span>
            </div>
        )
    }

    const maxChange = Math.max(...sectors.map(s => Math.abs(s.percentChange)))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Sector Relative Performance
                </h3>
            </div>

            <div className="space-y-3">
                {sectors.map((sector) => {
                    const isPositive = sector.percentChange >= 0
                    const widthPercent = (Math.abs(sector.percentChange) / maxChange) * 100

                    return (
                        <div key={sector.symbol} className="group">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-zinc-300">{sector.name}</span>
                                <span className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                                    {isPositive ? "+" : ""}{sector.percentChange.toFixed(2)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${widthPercent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full absolute top-0 ${isPositive ? "bg-emerald-500 left-0" : "bg-rose-500 right-0 ml-auto"}`} // Simplified for visual clarity: all bars start left but colored
                                    style={{ width: `${widthPercent}%`, backgroundColor: isPositive ? '#10b981' : '#f43f5e' }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-zinc-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Idx: {sector.price.toLocaleString("en-IN")}</span>
                                <span>Vol: {(sector.volume / 1000).toFixed(1)}K</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
