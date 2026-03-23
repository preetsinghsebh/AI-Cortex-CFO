"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, X, Bot, User, Loader2 } from "lucide-react"
import { sendChatMessage } from "@/lib/api"

import { useAgent } from "@/context/agent-context"

interface Message {
    role: "user" | "assistant"
    content: string
}

import { cn } from "@/lib/utils"

interface ChatOrbProps {
    isFixed?: boolean
    className?: string
    defaultOpen?: boolean
}

export function ChatOrb({ isFixed = true, className, defaultOpen = false }: ChatOrbProps) {
    const { currentAgent } = useAgent()
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Good morning. Markets look volatile today. How can I assist you?" }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)

    // Reset chat when agent changes
    useEffect(() => {
        setMessages([
            { role: "assistant", content: `(Switched to ${currentAgent.toUpperCase()}) How can I help?` }
        ])
    }, [currentAgent])

    // Initialize Speech APIs
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = false
                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    setInputValue(transcript)
                    setIsListening(false)
                    // Auto-send on voice input? Optional. Let's let user confirm for now.
                }
                recognitionRef.current.onerror = () => setIsListening(false)
                recognitionRef.current.onend = () => setIsListening(false)
            }
        }
    }, [])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
        } else {
            setInputValue("")
            recognitionRef.current?.start()
            setIsListening(true)
        }
    }

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return

        // Add user message
        const userMsg: Message = { role: "user", content: inputValue }
        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsLoading(true)

        try {
            // Send to Backend with currentAgent
            const data = await sendChatMessage(userMsg.content, messages, currentAgent)

            const aiMsg: Message = { role: "assistant", content: data.response }
            setMessages(prev => [...prev, aiMsg])

        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "I seem to be offline. Please check the neural connection." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn(
            "z-50 flex flex-col items-end",
            isFixed ? "fixed bottom-8 right-8" : "relative",
            className
        )}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-full md:w-[400px]"
                    >
                        <Card className="glass-heavy border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[500px] md:h-[600px] rounded-2xl">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full absolute bottom-0 right-0 animate-pulse" />
                                        <Avatar className="h-10 w-10 border border-white/10">
                                            <AvatarImage src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" />
                                            <AvatarFallback className="bg-zinc-800 text-emerald-400"><Bot size={18} /></AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white font-serif tracking-wide uppercase">{currentAgent}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">ONLINE</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-6">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-8 w-8 border border-white/10 mt-1 shrink-0">
                                                {msg.role === 'assistant' ? (
                                                    <AvatarFallback className="bg-zinc-900 text-emerald-400"><Bot size={14} /></AvatarFallback>
                                                ) : (
                                                    <AvatarFallback className="bg-zinc-900 text-white"><User size={14} /></AvatarFallback>
                                                )}
                                            </Avatar>

                                            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-md ${msg.role === 'user'
                                                    ? 'bg-emerald-600/20 border border-emerald-500/30 text-white rounded-2xl rounded-tr-sm'
                                                    : 'bg-white/5 border border-white/10 text-zinc-200 rounded-2xl rounded-tl-sm'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-zinc-600 mt-1 px-1">{msg.role === 'assistant' ? currentAgent.toUpperCase() : 'YOU'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8 border border-white/10 mt-1 shrink-0">
                                                <AvatarFallback className="bg-zinc-900 text-emerald-400"><Bot size={14} /></AvatarFallback>
                                            </Avatar>
                                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                                <Loader2 size={14} className="animate-spin text-emerald-500" />
                                                <span className="text-xs text-zinc-400 animate-pulse">Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md">
                                <div className="relative">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask Marcus..."
                                        className="bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500/50 text-white pl-4 pr-24 h-12 rounded-xl"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute right-2 top-2 flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className={`h-8 w-8 hover:bg-white/10 ${isListening ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}
                                            onClick={toggleListening}
                                        >
                                            <Mic size={18} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                                            onClick={handleSend}
                                            disabled={isLoading || !inputValue.trim()}
                                        >
                                            <Send size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="h-16 w-16 rounded-full bg-black border border-emerald-500/30 shadow-[0_0_30px_-5px_theme(colors.emerald.600)] flex items-center justify-center text-white relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors" />

                {/* Orbital Rings */}
                <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-spin-[3s_linear_infinite]" />
                <div className="absolute inset-2 border border-emerald-500/20 rounded-full animate-spin-[4s_linear_infinite_reverse]" />

                <div className="relative z-10">
                    {isOpen ? <X size={28} /> : <Bot size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                </div>
            </motion.button>
        </div>
    )
}
