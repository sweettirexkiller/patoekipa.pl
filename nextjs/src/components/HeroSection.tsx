'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { TextReveal, MagneticButton, TypewriterText, RotatingText } from './react-bits'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTeam = () => {
    const element = document.getElementById('team')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo/Image */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative w-80 h-80 md:w-96 md:h-96 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl animate-glow"></div>
              <Image
                src="/shared/assets/pato_ikona_2.png"
                alt="Patoekipa Logo"
                fill
                className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 animate-float"
                priority
              />
            </div>
          </div>

          {/* Main Text */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">
              <TypewriterText 
                texts={[
                  "Cześć, tutaj Patoekipa!",
                  "Witamy w naszym świecie!",
                  "Jesteśmy gotowi kodować!",
                  "Tworzymy przyszłość IT!"
                ]}
                typingSpeed={80}
                delayBetweenTexts={3000}
              />
            </h1>
            
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                <TextReveal text="Jesteśmy grupą przyjaciół z dzieciństwa, z której wszyscy skończyli w IT." />
              </div>
              
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
              
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex flex-wrap items-center justify-center">
                <TextReveal text="Jesteśmy gotowi do " delay={0.5} />
                <RotatingText 
                  words={[
                    'działania!',
                    'kodowania!', 
                    'tworzenia!',
                    'innowacji!',
                    'przyszłości!',
                    'współpracy!',
                    'rozwoju!',
                    'wyzwań!'
                  ]}
                  animationType="bounce"
                  interval={2000}
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <MagneticButton
                onClick={scrollToContact}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl text-lg shadow-lg overflow-hidden"
                strength={0.5}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Napisz do nas
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </MagneticButton>
              
              <MagneticButton
                onClick={scrollToTeam}
                className="group px-8 py-4 glass border border-white/20 dark:border-white/10 shadow-lg hover:bg-white/20 dark:hover:bg-white/10"
                strength={0.3}
              >
                <span className="flex items-center gap-2">
                  Poznaj zespół
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </MagneticButton>
            </div>
          </div>

          {/* Stats or Features */}
          <div className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Doświadczony zespół</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Lata doświadczenia w branży IT</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Nowoczesne technologie</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Najnowsze narzędzia i frameworki</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Pasja do kodu</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Miłość do programowania od dzieciństwa</p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={`transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="animate-bounce mt-12">
              <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-slate-400 dark:bg-slate-500 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 