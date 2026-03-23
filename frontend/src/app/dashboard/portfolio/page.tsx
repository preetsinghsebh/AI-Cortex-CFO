"use client"

import { useState, useEffect } from "react"
import { Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import Link from "next/link"

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                const res = await fetch(`${apiUrl}/api/portfolio`)
                if (res.ok) setPortfolio(await res.json())
            } catch (error) {
                console.error("Failed to fetch portfolio", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPortfolio()
    }, [])

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
                        <Briefcase className="text-indigo-400" /> Portfolio Holdings
                    </h2>
                    <p className="text-sm text-zinc-500">Real-time valuation and asset allocation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Balance</p>
                    <p className="text-3xl font-bold text-white font-mono">
                        ₹{portfolio ? portfolio.balance.toLocaleString("en-IN") : "..."}
                    </p>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Active Positions</p>
                    <p className="text-3xl font-bold text-white font-mono">
                        {portfolio ? Object.keys(portfolio.holdings).length : "..."}
                    </p>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Day Change</p>
                    <p className="text-3xl font-bold text-emerald-400 font-mono flex items-center gap-2">
                        +₹12,450 <ArrowUpRight size={24} />
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Symbol</th>
                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Quantity</th>
                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg Price</th>
                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Current Value</th>
                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolio && Object.entries(portfolio.holdings).map(([symbol, qty]: [string, any]) => (
                            <tr key={symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <Activity size={16} />
                                        </div>
                                        <span className="font-bold text-white uppercase">{symbol.replace('.NS', '')}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-zinc-300 font-mono">{qty}</td>
                                <td className="p-4 text-zinc-300 font-mono">₹1,240.00</td>
                                <td className="p-4 text-zinc-300 font-mono">₹{(qty * 1240).toLocaleString("en-IN")}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/dashboard/stock/${encodeURIComponent(symbol.replace('.NS', ''))}`} className="text-emerald-400 hover:text-emerald-300 text-sm font-bold tracking-wide">
                                        ANALYSIS
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!portfolio || Object.keys(portfolio.holdings).length === 0) && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                                    No active positions found in neural link.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
