import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reviews = [
    {
        text: "CortexCFO completely changed my morning routine. I wake up to a clean signal on Nifty & BankNifty, not noise. It's like having a dedicated analyst team in my pocket.",
        author: "Aryan Sharma",
        handle: "@aryan_scales",
        img: "https://images.unsplash.com/photo-1618641986557-1ecd2309594a?auto=format&fit=crop&w=100&q=80"
    },
    {
        text: "The risk management agent (Shield) saved me from the last midcap crash. It auto-hedged my portfolio while I was asleep. That one move paid for the subscription for life.",
        author: "Priya Patel",
        handle: "@trader_priya99",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
    },
    {
        text: "Finally, an AI that understands technicals AND sentiment for Indian stocks. Marcus isn't just a chatbot; he's a prop trader. The execution speed is unmatched.",
        author: "Rahul Verma",
        handle: "@rahul_v_",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
    },
    {
        text: "I used to spend 4 hours a day on research. Now I just ask Cortex to 'scan for breakout setups in F&O' and I get a list in seconds. It's almost unfair.",
        author: "Ananya Gupta",
        handle: "@ananya_g",
        img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=100&q=80"
    },
    {
        text: "Talk about power and clarity. The dashboard gives me exactly what I need to know about my holdings, when I need to know it. No more Zerodha/Groww fatigue.",
        author: "Vikram Malhotra",
        handle: "@vikram_alpha",
        img: "https://images.unsplash.com/photo-1560250097-9b93dbd96cd0?auto=format&fit=crop&w=100&q=80"
    },
    {
        text: "The 'Autonomous Hedge Fund' tagline isn't just marketing. It genuinely feels like a private fund is managing my assets. Incredible tech for the Indian investor.",
        author: "Sneha Reddy",
        handle: "@sneha_r_fi",
        img: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&w=100&q=80"
    }
]

export function Reviews() {
    return (
        <section className="py-32 bg-zinc-950 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="font-serif text-5xl md:text-6xl mb-6">Voices of Love</h2>
                    <p className="text-zinc-500 text-lg">Real voices shared by users, see how the world vibes with Cortex.</p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="break-inside-avoid bg-zinc-900/50 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors">
                            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={review.img} />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400">{review.author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-white text-sm">{review.author}</div>
                                    <div className="text-xs text-zinc-500">{review.handle}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
