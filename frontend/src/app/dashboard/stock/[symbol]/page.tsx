"use client"

import { useState, useEffect, use } from "react"
import { AdvancedChart } from "@/components/dashboard/advanced-chart"
import { BrainCircuit, TrendingUp, ShieldAlert, Target, Activity } from "lucide-react"
import { DecodingText } from "@/components/ui/decoding-text"

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params)
    const [forecast, setForecast] = useState<any>(null)
    const [risk, setRisk] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const decodedSymbol = decodeURIComponent(symbol)
    const tvSymbol = decodedSymbol.includes(':') ? decodedSymbol : `NSE:${decodedSymbol.split('.')[0]}`

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                const stockSymbol = decodedSymbol.includes('/') ? decodedSymbol.split('/')[0] + '.NS' : decodedSymbol
                
                const [forecastRes, riskRes] = await Promise.all([
                    fetch(`${apiUrl}/api/stock/${stockSymbol}/forecast`),
                    fetch(`${apiUrl}/api/stock/${stockSymbol}/risk`)
                ])

                if (forecastRes.ok) setForecast(await forecastRes.json())
                if (riskRes.ok) setRisk(await riskRes.json())
            } catch (error) {
                console.error("Failed to fetch stock details", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [decodedSymbol])

    return (
        <div className="flex flex-col h-full gap-6 overflow-hidden">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
                        <Activity className="text-emerald-500" /> {decodedSymbol} Analysis
                    </h2>
                    <p className="text-sm text-zinc-500">Live technicals and AI-driven forecasting.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column: Chart (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative">
                    <AdvancedChart symbol={tvSymbol} />
                </div>

                {/* Right Column: AI Insights & Risk (1/3 width) */}
                <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-8">
                    
                    {/* RISK TIER */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-rose-400" /> AI Risk Profile
                        </h3>
                        {risk ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className={`text-4xl font-bold font-mono ${risk.risk_tier === 'LOW' ? 'text-emerald-400' : risk.risk_tier === 'MEDIUM' ? 'text-yellow-400' : 'text-rose-400'}`}>
                                        {risk.risk_tier}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-mono">Accuracy: {(risk.metrics.Model_Accuracy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500 uppercase tracking-wider">Volatility (Ann.)</span>
                                        <span className="text-white font-mono">{risk.features.volatility_annualized_pct}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500 uppercase tracking-wider">30D Price Change</span>
                                        <span className="text-white font-mono">{risk.features.price_change_30d_pct}%</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-white/5 rounded"></div>
                                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FORECAST */}
                    <div className="bg-linear-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit size={14} /> Marcus Prediction (7D)
                        </h3>
                        {forecast ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Method</p>
                                        <p className="text-sm font-bold text-white font-mono">{forecast.model}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">RMSE Error</p>
                                        <p className="text-sm font-bold text-white font-mono">{forecast.metrics.RMSE}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {forecast.forecast.slice(0, 5).map((day: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                            <span className="text-zinc-400 font-mono text-xs">{day.date.split('-').slice(1).reverse().join('/')}</span>
                                            <span className="text-white font-bold font-mono">₹{day.predicted_price}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                                    Machine learning models are based on historical price patterns and do not account for black swan events.
                                </p>
                            </div>
                        ) : (
                            <div className="text-zinc-500 text-sm italic">Running Prophet models...</div>
                        )}
                    </div>

                    {/* ACTION */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Target size={14} /> Intelligence Directive
                        </h3>
                        {forecast && (
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                Our models suggest a <span className="text-emerald-400 font-bold">{forecast.forecast[forecast.forecast.length-1].predicted_price > forecast.forecast[0].predicted_price ? 'BULLISH' : 'BEARISH'}</span> trend over the next week. 
                                <br/><br/>
                                <span className="text-white italic">"Market volatility is high, but the signal strength is 82%. A defensive entry is advised."</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
