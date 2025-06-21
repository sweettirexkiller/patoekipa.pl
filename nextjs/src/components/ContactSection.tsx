'use client'

import { useState, useEffect, useRef } from 'react'
import { FloatingCard, ScrambledText, MagneticButton, LoadingSpinner } from './react-bits'

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSubmitStatus('success')
          setFormData({ name: '', email: '', message: '' })
        } else {
          setSubmitStatus('error')
        }
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 3000)
    }
  }

  const contactMethods = [
    {
      id: 'email',
      title: 'Email',
      description: 'Napisz do nas',
      value: 'kontakt@patoekipa.pl',
      href: 'mailto:kontakt@patoekipa.pl',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'phone',
      title: 'Telefon',
      description: 'Zadzwoń do nas',
      value: '+48 123 456 789',
      href: 'tel:+48123456789',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      description: 'Znajdź nas na LinkedIn',
      value: 'linkedin.com/company/patoekipa',
      href: 'https://linkedin.com/company/patoekipa',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
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
              <div className="glass rounded-3xl p-8 border border-white/10 h-full hover:border-white/20 transition-all duration-300">
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
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full btn-primary group relative overflow-hidden ${
                      isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                    } ${
                      submitStatus === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      submitStatus === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : ''
                    }`}
                    strength={isSubmitting ? 0 : 0.3}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" variant="dots" />
                          Wysyłanie...
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Wysłano!
                        </>
                      ) : submitStatus === 'error' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Błąd wysyłania
                        </>
                      ) : (
                        <>
                          Wyślij wiadomość
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </MagneticButton>
                </form>
              </div>
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
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block glass rounded-2xl p-6 border border-white/10 hover:bg-white/5 dark:hover:bg-white/5 hover:border-white/20 transition-all duration-300 group hover:scale-105"
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