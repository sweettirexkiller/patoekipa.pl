'use client'

import { motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'

interface FloatingDotsProps {
  count?: number
  className?: string
  dotSize?: number
  colors?: string[]
}

export function FloatingDots({ 
  count = 50, 
  className = '',
  dotSize = 4,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
}: FloatingDotsProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const dots = useMemo(() => {
    if (!isMounted) return []
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5,
    }))
  }, [count, colors, isMounted])

  if (!isMounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dotSize * dot.scale,
            height: dotSize * dot.scale,
            backgroundColor: dot.color,
            boxShadow: `0 0 ${dotSize * 2}px ${dot.color}40`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(dot.id) * 20, 0],
            scale: [dot.scale, dot.scale * 1.5, dot.scale],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  )
} 