'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface GlowingOrbsProps {
  count?: number
  className?: string
}

export function GlowingOrbs({ count = 8, className = '' }: GlowingOrbsProps) {
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      color: [
        'rgba(59, 130, 246, 0.6)', // blue
        'rgba(139, 92, 246, 0.6)', // purple
        'rgba(236, 72, 153, 0.6)', // pink
        'rgba(6, 182, 212, 0.6)',  // cyan
        'rgba(16, 185, 129, 0.6)', // emerald
      ][Math.floor(Math.random() * 5)],
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 4,
    }))
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-md"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${orb.size * 2}px ${orb.color}, 0 0 ${orb.size * 4}px ${orb.color}40`,
          }}
          animate={{
            x: [0, Math.sin(orb.id) * 200, Math.cos(orb.id) * 150, 0],
            y: [0, Math.cos(orb.id) * 150, Math.sin(orb.id) * 200, 0],
            scale: [1, 1.5, 0.8, 1],
            opacity: [0.3, 0.8, 0.4, 0.3],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}
    </div>
  )
} 