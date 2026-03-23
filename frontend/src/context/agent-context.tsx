"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type AgentId = "marcus" | "apex" | "warren" | "shield" | "memelord" | "oracle"

interface AgentContextType {
    currentAgent: AgentId
    setAgent: (agent: AgentId) => void
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

export function AgentProvider({ children }: { children: React.ReactNode }) {
    const [currentAgent, setCurrentAgent] = useState<AgentId>("marcus")

    return (
        <AgentContext.Provider value={{ currentAgent, setAgent: setCurrentAgent }}>
            {children}
        </AgentContext.Provider>
    )
}

export function useAgent() {
    const context = useContext(AgentContext)
    if (context === undefined) {
        throw new Error("useAgent must be used within an AgentProvider")
    }
    return context
}
