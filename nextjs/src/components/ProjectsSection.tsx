'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { FloatingCard, ScrambledText, TextReveal, RotatingText } from './react-bits'

interface Project {
  image: string
  title: string
  subtitle: string
  androidLink?: string
  iosLink?: string
  webLink?: string
  tags?: string[]
  featured?: boolean
}

const workProjects: Project[] = [
  {
    image: '/shared/assets/projects/w01.png',
    title: 'FlexiFlow CRM',
    subtitle: 'Nowoczesny system CRM dla małych i średnich przedsiębiorstw z zaawansowaną automatyzacją procesów sprzedażowych.',
    webLink: '#',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    featured: true
  },
  {
    image: '/shared/assets/projects/w02.png',
    title: 'EcoTrack Mobile',
    subtitle: 'Aplikacja mobilna do monitorowania śladu węglowego dla firm świadomych ekologicznie.',
    androidLink: '#',
    iosLink: '#',
    tags: ['Flutter', 'Firebase', 'Analytics'],
    featured: true
  },
  {
    image: '/shared/assets/projects/w03.jpeg',
    title: 'SmartInventory Pro',
    subtitle: 'Zaawansowany system zarządzania magazynem z AI do przewidywania popytu i optymalizacji dostaw.',
    webLink: '#',
    tags: ['Vue.js', 'Python', 'AI/ML'],
    featured: false
  },
]

const hobbyProjects: Project[] = [
  {
    image: '/shared/assets/projects/1.png',
    title: 'CodeQuest Academy',
    subtitle: 'Interaktywna platforma do nauki programowania z gamifikacją i wyzwaniami dla początkujących.',
    androidLink: '#',
    tags: ['Flutter', 'Education', 'Gamification'],
    featured: false
  },
  {
    image: '/shared/assets/projects/02.png',
    title: 'MindPalace Notes',
    subtitle: 'Aplikacja do tworzenia map myśli i organizacji wiedzy z wykorzystaniem technik mnemonicznych.',
    androidLink: '#',
    iosLink: '#',
    tags: ['React Native', 'Productivity', 'AI'],
    featured: false
  },
  {
    image: '/shared/assets/projects/03.png',
    title: 'FitTracker Pro',
    subtitle: 'Kompleksowa aplikacja fitness z personalizowanymi planami treningowymi i monitoringiem postępów.',
    androidLink: '#',
    iosLink: '#',
    tags: ['Flutter', 'Health', 'Analytics'],
    featured: false
  },
  {
    image: '/shared/assets/projects/04.png',
    title: 'BudgetWise',
    subtitle: 'Inteligentna aplikacja do zarządzania budżetem domowym z analizą wydatków i prognozami.',
    androidLink: '#',
    tags: ['React Native', 'Finance', 'AI'],
    featured: false
  },
  {
    image: '/shared/assets/projects/05.png',
    title: 'TaskMaster 3000',
    subtitle: 'Zaawansowany menedżer zadań z metodologią GTD i integracją z popularnymi narzędziami produktywności.',
    androidLink: '#',
    iosLink: '#',
    tags: ['Flutter', 'Productivity', 'Cloud'],
    featured: false
  },
  {
    image: '/shared/assets/projects/06.png',
    title: 'RecipeVault',
    subtitle: 'Cyfrowa książka kucharska z AI do sugerowania przepisów na podstawie dostępnych składników.',
    androidLink: '#',
    iosLink: '#',
    tags: ['React Native', 'AI', 'Lifestyle'],
    featured: false
  },
]

const projectCategories = [
  'Komercyjne',
  'Hobbystyczne',
  'Wszystkie'
]

function ProjectCard({ project, index, isHovered, onHover }: { 
  project: Project; 
  index: number; 
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  return (
    <div 
      className={`transition-all duration-500 ${
        project.featured ? 'md:col-span-2' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="group glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl h-full flex flex-col border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ Featured
              </div>
            )}
            
            {/* Tags */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {project.tags?.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20"
                >
                  {tag}
                </span>
              ))}
              {project.tags && project.tags.length > 2 && (
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:gradient-text transition-all duration-300">
              {isHovered ? (
                <ScrambledText 
                  text={project.title}
                  className="gradient-text"
                  scrambleSpeed={25}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz "
                />
              ) : (
                project.title
              )}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed flex-1">
              {project.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {project.androidLink && (
                <a
                  href={project.androidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m11.4653-6.02c0-.9174-.7326-1.6497-1.6497-1.6497H7.6826c-.9174 0-1.6497.7323-1.6497 1.6497v.8248c0 .9174.7323 1.6497 1.6497 1.6497h8.9653c.9171 0 1.6497-.7323 1.6497-1.6497v-.8248z"/>
                  </svg>
                  Android
                </a>
              )}
              {project.iosLink && (
                <a
                  href={project.iosLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  iOS
                </a>
              )}
              {project.webLink && (
                <a
                  href={project.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Web
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Wszystkie')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
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

  const getFilteredProjects = () => {
    if (activeCategory === 'Wszystkie') {
      return [...workProjects, ...hobbyProjects]
    } else if (activeCategory === 'Komercyjne') {
      return workProjects
    } else {
      return hobbyProjects
    }
  }

  const filteredProjects = getFilteredProjects()

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Nasze Realizacje
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            <TextReveal text="Nasze" delay={0.2} />
            {' '}
            <span className="gradient-text">
              <RotatingText 
                words={['Projekty', 'Aplikacje', 'Rozwiązania', 'Dzieła']}
                animationType="flip"
                interval={3000}
              />
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            <TextReveal 
              text="Poznaj aplikacje i systemy, które stworzyliśmy dla naszych klientów i jako projekty hobbystyczne"
              delay={0.5}
            />
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="glass rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              {projectCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={`${project.title}-${activeCategory}`}
              project={project} 
              index={index}
              isHovered={hoveredProject === project.title}
              onHover={(hovered) => setHoveredProject(hovered ? project.title : null)}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold gradient-text mb-2">
                  {workProjects.length + hobbyProjects.length}+
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Ukończonych Projektów
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold gradient-text mb-2">
                  100%
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Zadowolonych Klientów
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold gradient-text mb-2">
                  24/7
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Wsparcie Techniczne
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 