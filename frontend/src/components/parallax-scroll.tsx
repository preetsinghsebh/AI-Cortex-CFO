"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export function ParallaxScroll({ children, className, offset = 50 }: { children: React.ReactNode, className?: string, offset?: number }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, -offset])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <motion.div ref={ref} style={{ y, opacity }} className={className}>
            {children}
        </motion.div>
    )
}

export function Reveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}
