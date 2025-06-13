'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ScrambledText, MagneticButton } from './react-bits'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { id: 'home', label: 'Start', section: 'home' },
    { id: 'team', label: 'Zespół', section: 'team' },
    { id: 'skills', label: 'Umiejętności', section: 'skills' },
    { id: 'projects', label: 'Projekty', section: 'projects' },
    { id: 'testimonials', label: 'Opinie', section: 'testimonials' },
    { id: 'contact', label: 'Kontakt', section: 'contact' }
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass border-b border-white/10 shadow-lg backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <MagneticButton
            onClick={() => scrollToSection('home')}
            className="flex items-center space-x-3 cursor-pointer group"
            strength={0.3}
          >
            <h3 className="text-3xl md:text-4xl font-bold gradient-text">
              Patoekipa
            </h3>
          </MagneticButton>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-300 group"
              >
                {hoveredItem === item.id ? (
                  <ScrambledText 
                    text={item.label}
                    className="gradient-text font-semibold"
                    scrambleSpeed={25}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                  />
                ) : (
                  item.label
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass border border-white/20 hover:bg-white/10 transition-colors"
          >
            <svg
              className={`w-6 h-6 text-slate-700 dark:text-slate-300 transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`block w-full text-left px-4 py-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
                  {hoveredItem === item.id ? (
                    <ScrambledText 
                      text={item.label}
                      className="gradient-text font-semibold"
                      scrambleSpeed={30}
                    />
                  ) : (
                    item.label
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
} 