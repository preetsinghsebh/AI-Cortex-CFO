"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const agents = [
    { name: "Marcus", role: "Chief CFO", color: "bg-emerald-100 text-emerald-800" },
    { name: "Apex", role: "High Risk", color: "bg-red-100 text-red-800" },
    { name: "Warren", role: "Value", color: "bg-blue-100 text-blue-800" },
    { name: "Shield", role: "Hedging", color: "bg-stone-100 text-stone-800" },
    { name: "Meme", role: "Trends", color: "bg-purple-100 text-purple-800" },
]

export function CurvedCarousel() {
    return (
        <div className="w-full relative h-[400px] overflow-hidden flex items-center justify-center perspective-1000">
            <div className="flex gap-4 items-center justify-center transform-style-3d">
                {agents.map((agent, i) => (
                    <Card key={i} agent={agent} index={i} total={agents.length} />
                ))}
            </div>
        </div>
    )
}

function Card({ agent, index, total }: { agent: any, index: number, total: number }) {
    // Calc curvature
    const offsetFromCenter = index - (total - 1) / 2
    const rotateY = offsetFromCenter * 5 // 5 degrees per card
    const translateZ = Math.abs(offsetFromCenter) * -20 // Push back sides

    return (
        <motion.div
            className={`w-[220px] h-[320px] rounded-2xl border border-black/5 shadow-2xl bg-white flex flex-col items-center justify-center p-6 transition-all duration-500 hover:-translate-y-4 cursor-pointer`}
            style={{
                transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                zIndex: 10 - Math.abs(Math.round(offsetFromCenter))
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className={`w-24 h-24 rounded-full ${agent.color} flex items-center justify-center text-2xl font-bold mb-4`}>
                {agent.name[0]}
            </div>
            <h3 className="font-serif text-xl font-bold text-black">{agent.name}</h3>
            <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">{agent.role}</p>

            <div className="mt-6 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-black/10 w-[60%]" />
            </div>
            <div className="flex justify-between w-full mt-2 text-xs text-zinc-400">
                <span>Performance</span>
                <span>+12%</span>
            </div>
        </motion.div>
    )
}
