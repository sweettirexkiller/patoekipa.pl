'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrambledText } from './react-bits'

interface PlatformItem {
  title: string
  description: string
  icon: string
  gradient: string
}

interface SkillItem {
  title: string
  category: string
  icon: string
  level: number
  color: string
}

const platformItems: PlatformItem[] = [
  {
    title: 'Web Development',
    description: 'Nowoczesne aplikacje webowe',
    icon: '🌐',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Mobile Apps',
    description: 'Aplikacje mobilne iOS/Android',
    icon: '📱',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Desktop Apps',
    description: 'Aplikacje desktopowe',
    icon: '💻',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Cloud Solutions',
    description: 'Rozwiązania chmurowe',
    icon: '☁️',
    gradient: 'from-orange-500 to-red-500'
  }
]

const skillItems: SkillItem[] = [
  { title: 'React', category: 'Frontend', icon: '⚛️', level: 95, color: 'text-blue-500' },
  { title: 'Next.js', category: 'Framework', icon: '▲', level: 90, color: 'text-slate-800 dark:text-white' },
  { title: 'TypeScript', category: 'Language', icon: 'TS', level: 88, color: 'text-blue-600' },
  { title: 'Node.js', category: 'Backend', icon: '🟢', level: 85, color: 'text-green-600' },
  { title: 'Python', category: 'Language', icon: '🐍', level: 82, color: 'text-yellow-500' },
  { title: 'PostgreSQL', category: 'Database', icon: '🐘', level: 80, color: 'text-blue-700' },
  { title: 'Docker', category: 'DevOps', icon: '🐳', level: 78, color: 'text-blue-500' },
  { title: 'AWS', category: 'Cloud', icon: '☁️', level: 75, color: 'text-orange-500' },
  { title: 'React Native', category: 'Mobile', icon: '📱', level: 85, color: 'text-blue-400' },
  { title: 'Flutter', category: 'Mobile', icon: '🦋', level: 70, color: 'text-blue-400' },
  { title: 'GraphQL', category: 'API', icon: '◆', level: 75, color: 'text-pink-500' },
  { title: 'MongoDB', category: 'Database', icon: '🍃', level: 80, color: 'text-green-500' }
]

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Nasze Umiejętności
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Technologie &{' '}
            <span className="gradient-text">
              Platformy
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Specjalizujemy się w nowoczesnych technologiach i narzędziach programistycznych
          </p>
        </div>

        {/* Platforms Section */}
        <div className="mb-20">
          <h3 className={`text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Platformy Rozwoju
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {platformItems.map((item, index) => (
              <div
                key={item.title}
                className={`animate-fade-in-up ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="group glass rounded-3xl p-8 shadow-lg hover:shadow-xl h-full flex flex-col border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center space-y-6">
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg flex items-center justify-center`}>
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className={`text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Stack Technologiczny
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {skillItems.map((item, index) => (
              <div
                key={item.title}
                className={`animate-fade-in-up ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                onMouseEnter={() => setHoveredSkill(item.title)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="group glass rounded-3xl p-6 shadow-lg hover:shadow-xl h-full flex flex-col border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                      <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold ${item.color}`}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <div className="text-center flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                        {hoveredSkill === item.title ? (
                          <ScrambledText 
                            text={item.title}
                            className="gradient-text"
                            scrambleSpeed={25}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                          />
                        ) : (
                          item.title
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {item.category}
                      </p>
                      
                      {/* Skill Level Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: isVisible ? `${item.level}%` : '0%',
                            transitionDelay: `${(index + 4) * 100 + 500}ms`
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {item.level}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Potrzebujesz ekspertów w tych technologiach?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Skorzystaj z naszego doświadczenia i rozpocznij swój projekt już dziś
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const element = document.getElementById('projects')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="btn-primary group"
              >
                <span className="flex items-center gap-2">
                  Zobacz projekty
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById('contact')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="btn-secondary group"
              >
                <span className="flex items-center gap-2">
                  Skontaktuj się
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 