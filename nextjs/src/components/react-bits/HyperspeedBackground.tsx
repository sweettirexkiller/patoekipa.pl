'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface HyperspeedBackgroundProps {
  className?: string
  lineCount?: number
  colors?: string[]
  speed?: number
}

export function HyperspeedBackground({ 
  className = '',
  lineCount = 50,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  speed = 1
}: HyperspeedBackgroundProps) {
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      length: 20 + Math.random() * 80,
      angle: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.7,
    }))
  }, [lineCount, colors])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: `${line.length}px`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${line.color}, transparent)`,
            transform: `rotate(${line.angle}deg)`,
            opacity: line.opacity,
          }}
          animate={{
            x: ['-100px', '100vw'],
            opacity: [0, line.opacity, 0],
          }}
          transition={{
            duration: 3 / (line.speed * speed),
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/20 dark:to-slate-100/5" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900/20 dark:to-slate-100/5" />
    </div>
  )
} 