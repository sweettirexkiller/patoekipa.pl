'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ScrambledTextProps {
  text: string
  className?: string
  scrambleSpeed?: number
  revealSpeed?: number
  characters?: string
}

export function ScrambledText({ 
  text, 
  className = '', 
  scrambleSpeed = 50,
  revealSpeed = 100,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
}: ScrambledTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrambleText = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    let iteration = 0
    
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )
      
      if (iteration >= text.length) {
        clearInterval(interval)
        setIsAnimating(false)
      }
      
      iteration += 1 / 3
    }, scrambleSpeed)
    
    intervalRef.current = interval
  }

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => {
      scrambleText()
    }, 500)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, scrambleSpeed, characters, isAnimating])

  return (
    <motion.span
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={scrambleText}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {displayText || text}
    </motion.span>
  )
} 