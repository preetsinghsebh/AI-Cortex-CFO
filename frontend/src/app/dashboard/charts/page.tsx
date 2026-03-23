"use client"

import { AdvancedChart } from "@/components/dashboard/advanced-chart"
import { LineChart, Maximize2 } from "lucide-react"

export default function ChartsPage() {
    return (
        <div className="flex flex-col h-full gap-4 overflow-hidden">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
                        <LineChart className="text-blue-500" /> Advanced Charting
                    </h2>
                    <p className="text-sm text-zinc-500">Professional-grade technical analysis tools.</p>
                </div>
                <div className="flex gap-2">
                    <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors flex items-center gap-2">
                        <Maximize2 size={12} /> Full Screen
                    </button>
                </div>
            </div>

            {/* Main Chart Container */}
            <div className="flex-1 min-h-[400px] lg:min-h-0 glass-card rounded-3xl overflow-hidden relative">
                <AdvancedChart />
            </div>
        </div>
    )
}
