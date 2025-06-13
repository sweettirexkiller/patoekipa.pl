'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { FloatingCard, ScrambledText, MagneticButton } from './react-bits'

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const contactMethods = [
    {
      id: 'email',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      description: 'Napisz do nas',
      value: 'contact@patoekipa.pl',
      href: 'mailto:contact@patoekipa.pl'
    },
    {
      id: 'github',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      ),
      title: 'GitHub',
      description: 'Zobacz nasze projekty',
      value: 'github.com/patoekipa',
      href: 'https://github.com/patoekipa'
    },
    {
      id: 'linkedin',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'LinkedIn',
      description: 'Połącz się z nami',
      value: 'linkedin.com/company/patoekipa',
      href: 'https://linkedin.com/company/patoekipa'
    }
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-6 relative">
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
              Skontaktuj się z nami
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Rozpocznijmy{' '}
            <span className="gradient-text">
              Współpracę
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Masz projekt do realizacji? Napisz do nas i porozmawiajmy o Twoich potrzebach
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <FloatingCard
                className="h-full"
                glowColor="rgba(59, 130, 246, 0.4)"
                intensity={0.4}
              >
                <div className="glass rounded-3xl p-8 border border-white/10 h-full">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    <ScrambledText 
                      text="Wyślij wiadomość"
                      className="gradient-text"
                      scrambleSpeed={40}
                    />
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {focusedField === 'name' ? (
                            <ScrambledText 
                              text="Imię i nazwisko"
                              scrambleSpeed={20}
                              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz "
                            />
                          ) : (
                            'Imię i nazwisko'
                          )}
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Jan Kowalski"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {focusedField === 'email' ? (
                            <ScrambledText 
                              text="Email"
                              scrambleSpeed={20}
                              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            />
                          ) : (
                            'Email'
                          )}
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="jan@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {focusedField === 'message' ? (
                          <ScrambledText 
                            text="Wiadomość"
                            scrambleSpeed={20}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                          />
                        ) : (
                          'Wiadomość'
                        )}
                      </label>
                      <textarea
                        name="message"
                        placeholder="Opisz swój projekt lub zadaj pytanie..."
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <MagneticButton
                      className="w-full btn-primary group"
                      strength={0.3}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Wyślij wiadomość
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                    </MagneticButton>
                  </form>
                </div>
              </FloatingCard>
            </div>

            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    Inne sposoby kontaktu
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Preferujesz bezpośredni kontakt? Skorzystaj z jednej z poniższych opcji, aby się z nami skontaktować.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={method.id}
                      className={`transition-all duration-500 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                      }`}
                      style={{ transitionDelay: `${index * 150 + 600}ms` }}
                      onMouseEnter={() => setHoveredMethod(method.id)}
                      onMouseLeave={() => setHoveredMethod(null)}
                    >
                      <FloatingCard
                        className="w-full"
                        glowColor={`rgba(${index === 0 ? '59, 130, 246' : index === 1 ? '139, 92, 246' : '236, 72, 153'}, 0.3)`}
                        intensity={0.3}
                      >
                        <a
                          href={method.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block glass rounded-2xl p-6 border border-white/10 hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                              index === 0 ? 'from-blue-500 to-blue-600' :
                              index === 1 ? 'from-purple-500 to-purple-600' :
                              'from-pink-500 to-pink-600'
                            } flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                                {hoveredMethod === method.id ? (
                                  <ScrambledText 
                                    text={method.title}
                                    className="gradient-text"
                                    scrambleSpeed={25}
                                  />
                                ) : (
                                  method.title
                                )}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                {method.description}
                              </p>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {method.value}
                              </p>
                            </div>
                            <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </FloatingCard>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className={`transition-all duration-1000 delay-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                  <FloatingCard
                    className="w-full"
                    glowColor="rgba(16, 185, 129, 0.3)"
                    intensity={0.3}
                  >
                    <div className="glass rounded-2xl p-6 border border-white/10">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                            Czas odpowiedzi
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Odpowiadamy na wszystkie wiadomości w ciągu 24 godzin w dni robocze. 
                            W przypadku pilnych projektów, skontaktuj się z nami bezpośrednio przez telefon.
                          </p>
                        </div>
                      </div>
                    </div>
                  </FloatingCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 