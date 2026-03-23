"use client"

import React, { createContext, useContext, useState } from "react"

export interface Message {
    id?: string
    role: string
    content: string
    timestamp?: string
    agent?: string
    attachments?: string[]
}

interface ChatContextType {
    messages: Message[]
    addMessage: (msg: Message) => void
    input: string
    setInput: (s: string) => void
    isAnalyzing: boolean
    setIsAnalyzing: (b: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Markets are volatile today. I'm monitoring Bank Nifty support levels closely." }
    ])
    const [input, setInput] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const addMessage = (msg: Message) => {
        setMessages(prev => [...prev, msg])
    }

    return (
        <ChatContext.Provider value={{
            messages,
            addMessage,
            input,
            setInput,
            isAnalyzing,
            setIsAnalyzing
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider")
    }
    return context
}
