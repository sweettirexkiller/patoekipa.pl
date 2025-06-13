'use client'

import { useState, useEffect, useRef } from 'react'
import { FloatingCard, ScrambledText, RotatingText, TextReveal } from './react-bits'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Anna Kowalska',
    role: 'CEO',
    company: 'TechStart Sp. z o.o.',
    content: 'Patoekipa dostarczyła nam niesamowitą aplikację mobilną. Ich profesjonalizm i kreatywność przeszły nasze najśmielsze oczekiwania. Polecam każdemu!',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    id: '2',
    name: 'Marcin Nowak',
    role: 'CTO',
    company: 'InnovateLab',
    content: 'Współpraca z zespołem była płynna i efektywna. Otrzymaliśmy dokładnie to, czego potrzebowaliśmy - nowoczesną platformę webową o wysokiej wydajności.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    id: '3',
    name: 'Katarzyna Wiśniewska',
    role: 'Product Manager',
    company: 'DigitalFlow',
    content: 'Ich znajomość najnowszych technologii i umiejętność rozwiązywania problemów sprawiły, że nasz projekt został ukończony przed terminem.',
    rating: 5,
    avatar: '👩‍🚀'
  },
  {
    id: '4',
    name: 'Tomasz Zieliński',
    role: 'Founder',
    company: 'StartupHub',
    content: 'Patoekipa nie tylko zrealizowała nasze wymagania, ale także zaproponowała innowacyjne rozwiązania, które znacznie poprawiły funkcjonalność naszego produktu.',
    rating: 5,
    avatar: '🚀'
  },
  {
    id: '5',
    name: 'Magdalena Lewandowska',
    role: 'Marketing Director',
    company: 'BrandForce',
    content: 'Profesjonalne podejście, terminowość i wysoka jakość kodu. To zespół, na którym można polegać w każdym projekcie.',
    rating: 5,
    avatar: '💼'
  },
  {
    id: '6',
    name: 'Paweł Dąbrowski',
    role: 'Tech Lead',
    company: 'CloudSystems',
    content: 'Ich ekspertyza w zakresie architektury systemów i nowoczesnych frameworków pomogła nam zbudować skalowalną platformę enterprise.',
    rating: 5,
    avatar: '⚡'
  }
]

const positiveWords = [
  'Niesamowici!',
  'Profesjonalni!',
  'Kreatywni!',
  'Innowacyjni!',
  'Niezawodni!',
  'Eksperci!',
  'Fantastyczni!',
  'Doskonali!'
]

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
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

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isVisible])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400/5 to-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"></div>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Opinie Klientów
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            <TextReveal text="Nasi Klienci Mówią:" delay={0.2} />
            <br />
            <span className="gradient-text">
              <RotatingText 
                words={positiveWords}
                animationType="bounce"
                interval={2500}
              />
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            <TextReveal 
              text="Poznaj opinie firm, które zaufały naszej ekspertyzie i doświadczeniu"
              delay={0.5}
            />
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <FloatingCard
            className="max-w-4xl mx-auto"
            glowColor="rgba(6, 182, 212, 0.4)"
            intensity={0.5}
          >
            <div className="glass rounded-3xl p-8 md:p-12 border border-white/20 text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonials[currentTestimonial].rating)}
                </div>
                <blockquote className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonials[currentTestimonial].role} w {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>
              
              {/* Testimonial Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-125'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </FloatingCard>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150 + 600}ms` }}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <FloatingCard
                className="h-full"
                glowColor={`rgba(${index % 3 === 0 ? '6, 182, 212' : index % 3 === 1 ? '59, 130, 246' : '139, 92, 246'}, 0.3)`}
                intensity={0.3}
              >
                <div className="glass rounded-2xl p-6 h-full flex flex-col border border-white/10">
                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Content */}
                  <blockquote className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-1 text-sm italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                        {hoveredCard === testimonial.id ? (
                          <ScrambledText 
                            text={testimonial.name}
                            className="gradient-text"
                            scrambleSpeed={30}
                          />
                        ) : (
                          testimonial.name
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              <TextReveal text="Dołącz do Zadowolonych Klientów!" delay={1.2} />
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              <TextReveal 
                text="Rozpocznij swoją podróż z nami już dziś i zobacz, dlaczego firmy wybierają Patoekipę"
                delay={1.4}
              />
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="btn-primary group"
            >
              <span className="flex items-center gap-2">
                Rozpocznij Projekt
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 