"use client"

import { useState, useEffect } from "react"

interface DecodingTextProps {
    text: string
    speed?: number
    className?: string
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?"

export function DecodingText({ text, speed = 30, className }: DecodingTextProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        let iterations = 0
        const interval = setInterval(() => {
            setDisplayedText(() => {
                return text
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) {
                            return text[index]
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join("")
            })

            if (iterations >= text.length) {
                clearInterval(interval)
                setIsComplete(true)
            }

            iterations += 1 / 2 // Slower reveal for smoother effect
        }, speed)

        return () => clearInterval(interval)
    }, [text, speed])

    return <span className={className}>{displayedText}</span>
}
