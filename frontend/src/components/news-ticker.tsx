"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

interface NewsItem {
    title: string
    source: string
    category: string
}

export function NewsTicker() {
    // Mock data for initial render, later replaced by API call
    const [news, setNews] = useState<NewsItem[]>([
        { title: "Sensex crosses 75k mark for the first time", source: "NSE Feed", category: "Markets" },
        { title: "RBI Governor announces new digital currency pilot", source: "RBI", category: "Economy" },
        { title: "TCS bags $1B deal with UK insurer", source: "IT Wire", category: "Business" },
        { title: "Oil prices stable amidst geopolitical tensions", source: "Commodities", category: "Global" },
    ])

    return (
        <div className="w-full bg-black border-y border-zinc-800 py-2 overflow-hidden flex items-center relative z-40">
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wider mx-4 rounded whitespace-nowrap border border-emerald-500/20">
                LIVE MARKET FEED
            </div>

            <div className="flex overflow-hidden w-full mask-linear-fade">
                <motion.div
                    className="flex gap-8 items-center whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {[...news, ...news].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                            <span className="font-semibold text-zinc-200">{item.source}</span>
                            <span className="text-zinc-600">•</span>
                            <span>{item.title}</span>
                            <Separator orientation="vertical" className="h-3 bg-zinc-700 mx-2" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
