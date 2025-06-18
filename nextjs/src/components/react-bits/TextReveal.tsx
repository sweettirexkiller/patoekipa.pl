'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  staggerDelay?: number
  blur?: boolean
}

export function TextReveal({ 
  text, 
  className = '',
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.02,
  blur = true
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)
    
    return () => clearTimeout(timer)
  }, [delay])

  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const child = {
    hidden: { 
      y: 20, 
      opacity: 0,
      filter: blur ? 'blur(8px)' : 'none'
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 200,
        duration: duration,
      },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
} 