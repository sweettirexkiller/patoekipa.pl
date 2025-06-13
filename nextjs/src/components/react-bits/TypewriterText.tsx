'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  texts: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
  showCursor?: boolean
}

export function TypewriterText({ 
  texts,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 2000,
  showCursor = true
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const targetText = texts[currentTextIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1))
        } else {
          // Start deleting after delay
          setTimeout(() => setIsDeleting(true), delayBetweenTexts)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, texts, typingSpeed, deletingSpeed, delayBetweenTexts])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimeout = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimeout)
  }, [])

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        key={currentText}
        className="relative"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      >
        {currentText}
      </motion.span>
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-[1em] ml-1"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          }}
          animate={{
            opacity: cursorVisible ? 1 : 0,
            scaleY: [1, 1.1, 1],
          }}
          transition={{
            opacity: { duration: 0 },
            scaleY: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}
    </span>
  )
} 