'use client'

import { useState } from 'react'
import { FloatingCard, ScrambledText, MagneticButton, TextReveal } from './react-bits'

export function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/patoekipa',
      icon: (
        <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/patoekipa',
      icon: (
        <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Email',
      href: 'mailto:contact@patoekipa.pl',
      icon: (
        <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  const quickLinks = [
    { name: 'O nas', href: '#team' },
    { name: 'Umiejętności', href: '#skills' },
    { name: 'Projekty', href: '#projects' },
    { name: 'Opinie', href: '#testimonials' },
    { name: 'Kontakt', href: '#contact' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white py-16 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <FloatingCard
          className="mb-12"
          glowColor="rgba(59, 130, 246, 0.2)"
          intensity={0.3}
        >
          <div className="glass rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <MagneticButton
                  className="inline-block mb-6"
                  strength={0.2}
                >
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text">
                    Patoekipa
                  </h3>
                </MagneticButton>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  <TextReveal 
                    text="Grupa przyjaciół z dzieciństwa w IT, tworząca innowacyjne rozwiązania technologiczne z pasją i doświadczeniem."
                    delay={0.2}
                  />
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@patoekipa.pl</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Polska</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-white">
                  <ScrambledText 
                    text="Szybkie linki"
                    className="text-white"
                    scrambleSpeed={30}
                  />
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        onMouseEnter={() => setHoveredSocial(link.name)}
                        onMouseLeave={() => setHoveredSocial(null)}
                      >
                        {hoveredSocial === link.name ? (
                          <ScrambledText 
                            text={link.name}
                            className="text-blue-400"
                            scrambleSpeed={20}
                          />
                        ) : (
                          link.name
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-white">
                  <ScrambledText 
                    text="Usługi"
                    className="text-white"
                    scrambleSpeed={30}
                  />
                </h4>
                <ul className="space-y-3 text-slate-300">
                  <li>Aplikacje mobilne</li>
                  <li>Aplikacje webowe</li>
                  <li>Systemy zarządzania</li>
                  <li>Konsultacje IT</li>
                  <li>Wsparcie techniczne</li>
                </ul>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          {socialLinks.map((social) => (
            <div key={social.name} className="group">
              <MagneticButton
                onClick={() => window.open(social.href, '_blank')}
                strength={0.4}
                className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 border border-white/10"
                title={social.name}
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                {social.icon}
              </MagneticButton>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <FloatingCard
          className="mb-8"
          glowColor="rgba(139, 92, 246, 0.2)"
          intensity={0.2}
        >
          <div className="glass rounded-2xl p-6 border border-white/10 text-center max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-4 text-white">
              <ScrambledText 
                text="Bądź na bieżąco!"
                className="text-white"
                scrambleSpeed={25}
              />
            </h4>
            <p className="text-slate-300 mb-6">
              Zapisz się do naszego newslettera i otrzymuj najnowsze informacje o projektach i technologiach.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Twój adres email"
                className="flex-1 px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <MagneticButton 
                strength={0.3}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Zapisz się
              </MagneticButton>
            </div>
          </div>
        </FloatingCard>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Patoekipa. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              Made with 
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              in Poland
            </span>
            
            <span className="hidden md:block w-px h-4 bg-slate-600"></span>
            
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Powered by Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
} 