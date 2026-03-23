"use client"

import { Bot, Home, PieChart, Users, Bell, Activity, LineChart } from "lucide-react"
import { NavItem } from "@/components/dashboard/nav-item"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SidebarContent() {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                </div>
                <span className="text-lg font-serif font-bold tracking-tight text-white">CortexCFO</span>
            </div>

            <nav className="flex-1 px-3 space-y-2 mt-4">
                <NavItem icon={<Home size={20} />} label="Overview" href="/dashboard" />
                <NavItem icon={<Activity size={20} />} label="Sectors" href="/dashboard/sectors" />
                <NavItem icon={<LineChart size={20} />} label="Charts" href="/dashboard/charts" />
                <NavItem icon={<PieChart size={20} />} label="Portfolio" href="/dashboard/portfolio" />
                <NavItem icon={<Users size={20} />} label="Agents" href="/dashboard/agents" />
                <NavItem icon={<Bell size={20} />} label="Alerts" href="/dashboard/alerts" />
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                    <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-transparent group-hover:ring-emerald-500/50 transition-all">
                        <AvatarFallback className="bg-emerald-950 text-emerald-400 font-bold">PR</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-zinc-200">Preet</p>
                        <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
