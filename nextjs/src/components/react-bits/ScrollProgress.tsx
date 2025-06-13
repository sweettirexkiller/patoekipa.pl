'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ScrollProgressProps {
  className?: string
  height?: number
  showPercentage?: boolean
}

export function ScrollProgress({ 
  className = '',
  height = 4,
  showPercentage = false
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100))
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 origin-left ${className}`}
        style={{
          height: height,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
          scaleX,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        }}
      />
      
      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          className="fixed top-4 right-4 z-50 glass rounded-full px-3 py-1 border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: scrollPercent > 5 ? 1 : 0,
            scale: scrollPercent > 5 ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-bold gradient-text">
            {scrollPercent}%
          </span>
        </motion.div>
      )}
    </>
  )
} 