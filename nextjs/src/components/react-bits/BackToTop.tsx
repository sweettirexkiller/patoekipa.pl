'use client'

import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MagneticButton } from './MagneticButton'

interface BackToTopProps {
  className?: string
  threshold?: number
  showProgress?: boolean
}

export function BackToTop({ 
  className = '',
  threshold = 300,
  showProgress = true
}: BackToTopProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > threshold)
    })
    
    return () => unsubscribe()
  }, [scrollY, threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-8 right-8 z-50 ${className}`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <MagneticButton
            onClick={scrollToTop}
            className="relative group"
            strength={0.6}
          >
            <div className="relative w-14 h-14 glass rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 shadow-lg hover:shadow-xl">
              {/* Progress Ring */}
              {showProgress && (
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      pathLength: scrollYProgress,
                      strokeDasharray: "0 1"
                    }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              
              {/* Arrow Icon */}
              <motion.svg 
                className="w-6 h-6 text-white relative z-10"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" 
                />
              </motion.svg>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
            </div>
          </MagneticButton>
          
          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1 glass rounded-lg border border-white/20 text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            Powrót na górę
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 