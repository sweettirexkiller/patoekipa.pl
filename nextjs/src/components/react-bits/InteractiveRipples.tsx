'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
  color: string
}

interface InteractiveRipplesProps {
  className?: string
  colors?: string[]
}

export function InteractiveRipples({ 
  className = '', 
  colors = [
    'rgba(59, 130, 246, 0.6)',
    'rgba(139, 92, 246, 0.6)', 
    'rgba(236, 72, 153, 0.6)',
    'rgba(6, 182, 212, 0.6)',
    'rgba(16, 185, 129, 0.6)',
  ]
}: InteractiveRipplesProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const createRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1500)
  }, [colors])

  return (
    <div 
      className={`absolute inset-0 overflow-hidden cursor-pointer ${className}`}
      onClick={createRipple}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `radial-gradient(circle, ${ripple.color} 0%, transparent 70%)`,
              boxShadow: `0 0 50px ${ripple.color}`,
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.8,
              x: 0,
              y: 0,
            }}
            animate={{
              width: [0, 100, 200, 400],
              height: [0, 100, 200, 400],
              opacity: [0.8, 0.4, 0.2, 0],
              x: [0, -50, -100, -200],
              y: [0, -50, -100, -200],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              times: [0, 0.2, 0.5, 1],
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Instructional text */}
      <div className="absolute bottom-4 left-4 text-white/50 text-sm pointer-events-none">
        Click anywhere to create ripples
      </div>
    </div>
  )
} 