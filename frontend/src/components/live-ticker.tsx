"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TICKER_MESSAGES = [
    "SYSTEM ONLINE",
    "LATENCY: 12ms",
    "SCANNING MARKETS",
    "OPTIMIZING PORTFOLIO",
    "AI AGENTS ACTIVE"
]

export function LiveTicker() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex items-center justify-center w-full">
            <div className="relative h-6 min-w-[300px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute text-emerald-400 font-bold tracking-widest text-sm uppercase font-mono flex items-center gap-2"
                    >
                        <span>///</span>
                        {TICKER_MESSAGES[index]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
