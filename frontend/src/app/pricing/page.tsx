import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-black font-sans pt-20">
            <Navbar />

            <section className="py-20 container mx-auto px-4 text-center">
                <h1 className="font-serif text-5xl md:text-6xl mb-6">Simple, Transparent Pricing</h1>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-16">
                    Start for free. Upgrade when you're ready to scale your portfolio.
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Tier */}
                    <PricingCard
                        name="Starter"
                        price="₹0"
                        features={["Marcus Chat Access", "Market News Ticker", "End-of-Day Analysis", "1 Agent (Marcus Only)"]}
                        cta="Start Free"
                        popular={false}
                    />

                    {/* Pro Tier */}
                    <PricingCard
                        name="Pro Trader"
                        price="₹499"
                        period="/mo"
                        features={["Unlimited Chat", "Real-Time Alerts", "Access to All Agents", "Portfolio Hedging (Shield)", "Priority Support"]}
                        cta="Get Pro"
                        popular={true}
                    />

                    {/* Whale Tier */}
                    <PricingCard
                        name="Whale"
                        price="₹1,999"
                        period="/mo"
                        features={["Everything in Pro", "API Access", "Custom Agent Tuning", "1-on-1 Strategy Calls", "Institutional Data Feeds"]}
                        cta="Contact Sales"
                        popular={false}
                    />
                </div>
            </section>
            <Footer />
        </main>
    )
}

function PricingCard({ name, price, period, features, cta, popular }: any) {
    return (
        <div className={`rounded-3xl p-8 border ${popular ? 'border-emerald-500 bg-emerald-50/50 relative shadow-xl' : 'border-black/5 bg-white shadow-sm'} flex flex-col`}>
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            <div className="mb-6 text-left">
                <h3 className="font-serif text-2xl font-bold mb-2">{name}</h3>
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{price}</span>
                    {period && <span className="text-zinc-500 ml-1">{period}</span>}
                </div>
            </div>

            <div className="flex-1 space-y-4 mb-8 text-left">
                {features.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-zinc-600">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        {feat}
                    </div>
                ))}
            </div>

            <Button className={`w-full rounded-2xl h-12 font-semibold ${popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}>
                {cta}
            </Button>
        </div>
    )
}
