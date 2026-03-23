"use client"

import { SectorHeatmap } from "@/components/dashboard/sector-heatmap"
import { SectorPerformanceChart } from "@/components/dashboard/sector-performance-chart"
import { BrainCircuit, Zap } from "lucide-react"

export default function SectorsPage() {
    return (
        <div className="flex flex-col h-full gap-6 overflow-hidden">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
                        <ActivityIcon /> Sector Intelligence
                    </h2>
                    <p className="text-sm text-zinc-500">Real-time heatmaps and relative strength analysis.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                {/* Left Column: Heatmap (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col min-h-[500px] lg:min-h-0 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-1 relative">
                    <SectorHeatmap />
                </div>

                {/* Right Column: Performance Bars & Insights (1/3 width) */}
                <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide">

                    {/* Performance Bars */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0">
                        <SectorPerformanceChart />
                    </div>

                    {/* AI Insight */}
                    <div className="bg-linear-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BrainCircuit size={14} /> Marcus Insight
                        </h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            <span className="text-white font-bold">Banking is dragging Nifty down</span> while IT shows resilience.
                            The heatmap indicates a clear rotation away from rate-sensitive sectors.
                            <br /><br />
                            <strong>Strategy:</strong> Look for dip buys in <span className="text-emerald-400">TCS</span> and <span className="text-emerald-400">Infy</span> as they decouple from the broader index weakness.
                        </p>
                    </div>

                    {/* Quick Trade */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap size={14} /> Sector Play
                        </h3>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <div>
                                <p className="font-bold text-white">NIFTY IT ETF</p>
                                <p className="text-xs text-zinc-500">Momentum Breakout</p>
                            </div>
                            <button className="bg-white text-black text-xs font-bold px-3 py-2 rounded-lg hover:bg-zinc-200">
                                Trade
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function ActivityIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-500"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
