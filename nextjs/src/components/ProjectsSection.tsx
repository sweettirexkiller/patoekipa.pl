'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { FloatingCard, ScrambledText, TextReveal, RotatingText } from './react-bits'

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  technologies: string[]
  category: 'commercial' | 'hobby' | 'open_source' | 'internal'
  status: 'active' | 'completed' | 'archived' | 'in_progress' | 'planning'
  featured: boolean
  links: {
    androidLink?: string
    iosLink?: string
    webLink?: string
    githubLink?: string
    demoLink?: string
    documentationLink?: string
  }
  tags: string[]
}

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
              src={project.image || '/shared/assets/projects/1.png'}
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
              {project.technologies?.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20"
                >
                  {tag}
                </span>
              ))}
              {project.technologies && project.technologies.length > 2 && (
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20">
                  +{project.technologies.length - 2}
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
              {project.links.androidLink && (
                <a
                  href={project.links.androidLink}
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
              {project.links.iosLink && (
                <a
                  href={project.links.iosLink}
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
              {project.links.webLink && (
                <a
                  href={project.links.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Web
                </a>
              )}
              {project.links.githubLink && (
                <a
                  href={project.links.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
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
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const result = await response.json()
        const projectsData = result.success ? result.data : []
        setProjects(projectsData)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredProjects = () => {
    if (activeCategory === 'Wszystkie') {
      return projects
    }
    
    const categoryMap = {
      'Komercyjne': 'commercial',
      'Hobbystyczne': 'hobby'
    }
    
    return projects.filter(project => 
      project.category === categoryMap[activeCategory as keyof typeof categoryMap]
    )
  }

  const filteredProjects = getFilteredProjects()

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-6 relative">
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
              Nasze Projekty
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            <TextReveal text="Realizacje &" delay={0.2} />
            <br />
            <span className="gradient-text">
              <RotatingText 
                words={['Projekty', 'Innowacje', 'Rozwiązania', 'Aplikacje']}
                animationType="bounce"
                interval={2500}
              />
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            <TextReveal 
              text="Poznaj nasze najlepsze realizacje - od aplikacji mobilnych po kompleksowe systemy webowe"
              delay={0.5}
            />
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-wrap gap-3 p-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isHovered={hoveredProject === project.id}
                onHover={(hovered) => setHoveredProject(hovered ? project.id : null)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {activeCategory === 'Wszystkie' 
                  ? 'Brak projektów do wyświetlenia' 
                  : `Brak projektów w kategorii "${activeCategory}"`
                }
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Masz pomysł na projekt?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Skontaktuj się z nami i przekujmy Twoje pomysły w rzeczywistość
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
                Rozpocznij projekt
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