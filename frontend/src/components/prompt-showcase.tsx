import { ArrowUpRight } from "lucide-react"

const prompts = [
    "Why is HDFC Bank falling despite good quarterly results?",
    "Scan Nifty 50 for breakout stocks with high volume today.",
    "Analyze Reliance Industries' technical chart for the next week.",
    "What is the impact of the latest RBI policy on banking stocks?",
    "Find undervalued mid-cap stocks with strong fundamentals in India.",
    "Compare Tata Motors vs Maruti Suzuki for long-term investment."
]

export function PromptShowcase() {
    return (
        <section className="py-24 bg-zinc-950 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-5xl md:text-6xl mb-6">Ask Cortex Anything</h2>
                    <p className="text-zinc-500 text-lg">From deep analysis to quick pulse checks, just say it.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {prompts.map((prompt, i) => {
                        // Make the 3rd item "active" for the visual demo, or just stylistic choice
                        const isActive = i === 2

                        return (
                            <div
                                key={i}
                                className={`
                  group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer
                  ${isActive
                                        ? 'bg-zinc-100 text-black shadow-lg scale-105 z-10'
                                        : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                `}
                            >
                                <div className="flex justify-between items-center">
                                    <p className={`text-xl md:text-2xl font-medium ${isActive ? 'text-black' : 'text-current'}`}>
                                        “ {prompt} ”
                                    </p>
                                    {isActive && (
                                        <ArrowUpRight className="text-black/50" />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
