import Link from "next/link"
import { Brain, Twitter, Globe, Github, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
            <div className="container mx-auto px-6">
                {/* Top Section: Tagline */}
                <div className="mb-24">
                    <h2 className="font-serif text-5xl md:text-6xl max-w-4xl leading-tight">
                        The Neural Architecture of Wealth <span className="text-4xl">👋</span>
                    </h2>
                </div>

                {/* Middle Section: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
                    {/* Column 1: Why Cortex */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-6">Why Cortex</h4>
                        <ul className="space-y-4 text-zinc-400 text-sm">
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">About</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Daily Reports & Alerts</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Auto Trading Plan</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Smart Trading Strategies</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Empty/Extra (or merged with col 1 in design, but distinct here) */}
                    <div className="space-y-6 pt-0 md:pt-12">
                        <ul className="space-y-4 text-zinc-400 text-sm">
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Wallet Tracking & Copy Trade</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Trading Copilot</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Research & Data Visualization</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Discovery</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources & Community */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h4 className="font-bold text-lg">Resources</h4>
                            <ul className="space-y-4 text-zinc-400 text-sm">
                                <li><Link href="/" className="hover:text-emerald-400 transition-colors">Handbook</Link></li>
                                <li><Link href="/" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-lg">Community</h4>
                            <ul className="space-y-4 text-zinc-400 text-sm">
                                <li><Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">X (Twitter)</Link></li>
                                <li><Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">Discord</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 4: Policy */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg">Policy</h4>
                        <ul className="space-y-4 text-zinc-400 text-sm">
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Terms of use</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Security Audit</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1 rounded-full text-black">
                            <Brain size={20} />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-wide uppercase">CortexCFO</span>
                    </div>

                    <div className="text-zinc-500 text-sm">
                        © 2026 Cortex AI Inc.
                    </div>

                    <div className="flex gap-6 text-zinc-400">
                        <Link href="#" className="hover:text-white"><Globe size={20} /></Link>
                        <Link href="#" className="hover:text-white"><Twitter size={20} /></Link>
                        <Link href="#" className="hover:text-white"><Github size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
