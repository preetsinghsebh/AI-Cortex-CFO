import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-heavy">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-white">
                    <span className="text-xl font-serif font-bold tracking-tight">CortexCFO</span>
                </Link>
                <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">Live Dashboard</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/dashboard">
                        <Button className="rounded-full bg-black text-white hover:bg-zinc-800 px-6">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
