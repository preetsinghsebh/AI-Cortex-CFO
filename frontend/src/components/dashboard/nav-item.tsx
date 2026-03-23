"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
    icon: React.ReactNode
    label: string
    href: string
}

export function NavItem({ icon, label, href }: NavItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

    return (
        <Link href={href} className="w-full">
            <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
                } hidden lg:flex`}>
                {icon}
                {label}
            </button>
        </Link>
    )
}
