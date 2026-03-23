import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Reviews } from "@/components/reviews"
import { PromptShowcase } from "@/components/prompt-showcase"
import { NewsTicker } from "@/components/news-ticker"
import { ChatOrb } from "@/components/chat-orb"
import { AgentTeam } from "@/components/agent-team"
import { HeroCommandCenter } from "@/components/hero-command-center"
import { WarRoomWorkflow } from "@/components/war-room-workflow"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/parallax-scroll"
import { LiveTicker } from "@/components/live-ticker"
import { ArrowRight, Play } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* HERO SECTION - Immersive Background */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src="https://videos.pexels.com/video-files/1851190/1851190-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center pt-20 text-center">
                    <div className="w-full max-w-5xl flex flex-col items-center">
                        <Reveal>
                            <div className="flex gap-4 items-center mb-4">
                                <LiveTicker />
                            </div>
                            <h1 className="font-serif text-[12vw] leading-[0.85] font-bold tracking-tighter mix-blend-overlay opacity-90">
                                CORTEX
                            </h1>
                            <h1 className="font-serif text-[12vw] leading-[0.85] font-bold tracking-tighter text-white/90">
                                CFO
                            </h1>
                        </Reveal>

                        <div className="mt-12 w-full">
                            <HeroCommandCenter />
                        </div>

                    </div>

                </div>
            </section>

            {/* NEW AGENT TEAM SECTION */}
            <AgentTeam />

            {/* WAR ROOM WORKFLOW SECTION */}
            <WarRoomWorkflow />



            {/* Removed fixed ChatOrb */}

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-black">
                <NewsTicker />
            </div>

            <PromptShowcase />
            <Reviews />
            <Footer />
        </main>
    )
}




