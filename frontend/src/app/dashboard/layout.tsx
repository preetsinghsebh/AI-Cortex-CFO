"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, Send, Mic, Menu } from "lucide-react"
import { useAgent } from "@/context/agent-context"
import { useChat, Message } from "@/context/chat-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/dashboard/sidebar-content"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { currentAgent } = useAgent()
    const { messages, addMessage, input, setInput, isAnalyzing, setIsAnalyzing } = useChat()

    const handleSend = async () => {
        if (!input.trim()) return

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString(),
            attachments: []
        }
        addMessage(userMsg)
        setInput("")
        setIsAnalyzing(true)

        try {
            // Call Backend API
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    agent_id: currentAgent.toLowerCase(),
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await res.json()

            if (data.response) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response,
                    timestamp: new Date().toLocaleTimeString(),
                    agent: data.agent_id
                }
                addMessage(aiMsg)
            }
        } catch (error) {
            console.error("Chat Error:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="flex h-screen bg-transparent text-white font-sans overflow-hidden selection:bg-indigo-500/30">
            {/* Left Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col glass-heavy shrink-0 transition-all duration-300">
                <SidebarContent />
            </aside>

            {/* Center Zone (Command Center) */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden h-14 border-b border-white/10 flex items-center px-4 justify-between bg-black/50 backdrop-blur-sm shrink-0">
                    <span className="font-serif font-bold text-white">CortexCFO</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r border-white/10 w-72 bg-black text-white">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden relative">
                    {children}

                    {/* Chat Input (Float) - Global */}
                    <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-8 z-20 pointer-events-none">
                        <div className="max-w-3xl mx-auto pointer-events-auto">
                            {/* Messages Overlay */}
                            <div className="mb-4 space-y-2 max-h-[150px] overflow-y-auto scrollbar-hide mask-gradient-top">
                                {messages.slice(-2).map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-4 rounded-2xl text-sm shadow-xl backdrop-blur-md max-w-[80%] animate-in slide-in-from-bottom-2 fade-in ${msg.role === 'user'
                                            ? 'bg-emerald-600/90 text-white rounded-tr-sm'
                                            : 'bg-zinc-900/90 border border-white/10 text-zinc-200 rounded-tl-sm'
                                            }`}>
                                            {msg.role === 'assistant' && (
                                                <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                    <Bot size={12} /> {msg.agent || "Marcus"}
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-xl">
                                    <Mic size={20} />
                                </Button>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Ask ${currentAgent}...`}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-600 px-2 h-10 font-medium"
                                />
                                <Button size="icon" onClick={handleSend} className="bg-white hover:bg-zinc-200 text-black rounded-xl w-10 h-10">
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
