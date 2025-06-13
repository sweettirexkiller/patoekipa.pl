'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedGridProps {
  className?: string
  gridSize?: number
  intensity?: number
}

export function AnimatedGrid({ 
  className = '', 
  gridSize = 50,
  intensity = 0.1 
}: AnimatedGridProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, ${intensity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, ${intensity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        animate={{
          backgroundPosition: [
            '0px 0px',
            `${gridSize / 2}px ${gridSize / 2}px`,
            '0px 0px'
          ],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Interactive glow following mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          x: mousePosition.x + '%',
          y: mousePosition.y + '%',
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: { type: 'spring', stiffness: 50, damping: 20 },
          y: { type: 'spring', stiffness: 50, damping: 20 },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  )
} 