'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface RotatingTextProps {
  words: string[]
  className?: string
  interval?: number
  animationType?: 'slide' | 'fade' | 'flip' | 'bounce'
}

export function RotatingText({ 
  words,
  className = '',
  interval = 2500,
  animationType = 'slide'
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [words.length, interval])

  const getAnimationVariants = () => {
    switch (animationType) {
      case 'slide':
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 }
        }
      case 'fade':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 }
        }
      case 'flip':
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 }
        }
      case 'bounce':
        return {
          initial: { y: 30, opacity: 0, scale: 0.8 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -30, opacity: 0, scale: 0.8 }
        }
      default:
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 }
        }
    }
  }

  const variants = getAnimationVariants()

  return (
    <span className={`inline-block ${className}`} style={{ minWidth: 'fit-content' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration: 0.5,
            type: animationType === 'bounce' ? 'spring' : 'tween',
            stiffness: animationType === 'bounce' ? 300 : undefined,
            damping: animationType === 'bounce' ? 20 : undefined,
            ease: 'easeInOut'
          }}
          className="inline-block"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
          }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
} 