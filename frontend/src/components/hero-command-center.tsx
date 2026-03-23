"use client"

import { useRouter } from "next/navigation"
import { ArrowUp, Mic, Plus, Leaf, Lightbulb, Radio, X, FileText, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAgent } from "@/context/agent-context"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NEWS_ITEMS = [
    { title: "Sensex crosses 75k mark for the first time", source: "NSE" },
    { title: "RBI Governor announces new digital currency pilot", source: "RBI" },
    { title: "TCS bags $1B deal with UK insurer", source: "IT Wire" },
    { title: "Oil prices stable amidst geopolitical tensions", source: "Global" },
]

export function HeroCommandCenter() {
    const router = useRouter()
    const { currentAgent } = useAgent()
    const [mode, setMode] = useState<'normal' | 'deepthink'>('normal')
    const [isFocused, setIsFocused] = useState(false)
    const [newsIndex, setNewsIndex] = useState(0)
    const [inputValue, setInputValue] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [isNavigating, setIsNavigating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % NEWS_ITEMS.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const handleNewsClick = (title: string) => {
        setInputValue(`Analyze this news: ${title}`)
        setIsFocused(true)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles(prev => [...prev, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSearch = async () => {
        if (!inputValue.trim() && files.length === 0) return

        setIsNavigating(true)

        // Wait for exit animation
        await new Promise(resolve => setTimeout(resolve, 600))

        const params = new URLSearchParams()
        if (inputValue.trim()) params.set("q", inputValue.trim())

        router.push(`/dashboard?${params.toString()}`)
    }

    return (
        <div className="w-full max-w-3xl mx-auto relative z-50 flex flex-col gap-6">

            {/* Context Header */}
            <div className="text-center space-y-2">
                <p className="text-lg text-zinc-400">
                    <span className="text-white font-medium">Talk to <span className="text-emerald-400 font-bold">Marcus.</span> The brain behind your trades.</span>
                </p>
            </div>

            {/* The Command Console Container */}
            <motion.div
                layout
                className="relative group rounded-2xl"
            >
                {/* Neural Border Animation (DeepThink Mode) */}
                <div
                    className={cn(
                        "absolute -inset-[1px] rounded-2xl bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-500",
                        mode === 'deepthink' && "opacity-100 animate-border-rotate"
                    )}
                    style={{
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 3s linear infinite'
                    }}
                />

                {/* Ambient Glows */}
                <div className={cn(
                    "absolute -inset-0.5 rounded-2xl blur-xl opacity-50 transition-all duration-1000",
                    mode === 'deepthink'
                        ? "bg-linear-to-r from-blue-600/30 via-violet-600/30 to-blue-600/30 opacity-70"
                        : "bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 group-hover:opacity-100"
                )} />

                {/* Main Card */}
                <AnimatePresence>
                    {!isNavigating && (
                        <motion.div
                            exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className={cn(
                                "relative flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-500 overflow-hidden",
                                isFocused ? "border-white/20 shadow-2xl" : "hover:border-white/15",
                                mode === 'deepthink' && "border-blue-500/30"
                            )}
                        >
                            <div className="p-5">
                                {/* File Previews */}
                                <AnimatePresence>
                                    {files.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex gap-3 mb-4 overflow-x-auto py-2"
                                        >
                                            {files.map((file, index) => (
                                                <div key={index} className="relative group shrink-0">
                                                    <div className="w-16 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                                                        {file.type.startsWith('image/') ? (
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt="preview"
                                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                                            />
                                                        ) : (
                                                            <FileText className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-800 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Input Area */}
                                <div className="flex items-start mb-6">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onClick={() => !inputValue}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSearch()
                                            }
                                        }}
                                        placeholder="Ask anything..."
                                        className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-600 text-xl font-light tracking-wide resize-none min-h-[60px] cursor-text py-2"
                                    />
                                </div>

                                {/* Bottom Controls Row */}
                                <div className="flex items-center justify-between">
                                    {/* Left Side: Tools & Modes */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            multiple
                                            accept="image/*,application/pdf"
                                            onChange={handleFileSelect}
                                        />
                                        <button
                                            onClick={triggerFileInput}
                                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>

                                        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setMode('normal'); }}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                                                    mode === 'normal'
                                                        ? "bg-zinc-800 text-emerald-400 shadow-lg border border-white/5"
                                                        : "text-zinc-400 hover:text-zinc-200"
                                                )}
                                            >
                                                <Leaf size={14} />
                                                Normal
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setMode('deepthink'); }}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                                                    mode === 'deepthink'
                                                        ? "bg-zinc-800 text-blue-400 shadow-lg border border-white/5"
                                                        : "text-zinc-400 hover:text-zinc-200"
                                                )}
                                            >
                                                <Lightbulb size={14} />
                                                DeepThink
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Side: Voice & Send */}
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium hover:bg-white/10">
                                            <Mic size={16} />
                                            Voice
                                        </button>

                                        <button
                                            onClick={handleSearch}
                                            className={cn(
                                                "w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                                                mode === 'deepthink'
                                                    ? "bg-linear-to-r from-blue-600 to-violet-600 shadow-blue-500/20"
                                                    : "bg-[#10B981] hover:bg-[#059669] shadow-emerald-500/20"
                                            )}
                                        >
                                            <ArrowUp size={22} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated News Stream Footer */}
                            <div className="bg-black/40 border-t border-white/5 px-5 py-3 flex items-center gap-4">
                                <div className="flex items-center gap-2 text-blue-400 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
                                    <Radio size={14} className="animate-pulse" />
                                    <span>Raw Intelligence</span>
                                </div>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <div className="relative h-5 overflow-hidden flex-1 group/news cursor-pointer" onClick={() => handleNewsClick(NEWS_ITEMS[newsIndex].title)}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={newsIndex}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0 flex items-center gap-2 text-xs truncate"
                                        >
                                            <span className="text-zinc-600 font-mono text-[11px] uppercase">[{NEWS_ITEMS[newsIndex].source}]</span>
                                            <span className="text-zinc-400 group-hover/news:text-blue-300 transition-colors">{NEWS_ITEMS[newsIndex].title}</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    )
}
