'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  range?: number
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  title?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function MagneticButton({ 
  children, 
  className = '',
  strength = 0.4,
  range = 80,
  onClick,
  disabled,
  type = 'button',
  title,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
    
    if (distance < range) {
      x.set(distanceX * strength)
      y.set(distanceY * strength)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    onMouseLeaveProp?.()
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnterProp?.()
  }

  const MotionComponent = motion.button

  return (
    <MotionComponent
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
      
      {/* Magnetic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />
    </MotionComponent>
  )
} 