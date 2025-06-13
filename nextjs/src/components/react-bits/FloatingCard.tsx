'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function FloatingCard({ 
  children, 
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.5)',
  intensity = 0.3
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity * 30, -intensity * 30])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity * 30, intensity * 30])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2)
    const mouseY = (e.clientY - centerY) / (rect.height / 2)
    
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main card */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {children}
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
            whileHover={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Highlight effect following mouse */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        
        {/* Shadow */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(20px)',
            transform: 'translateZ(-50px) scale(0.9)',
            zIndex: -1,
          }}
          initial={{ opacity: 0.3 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
} 