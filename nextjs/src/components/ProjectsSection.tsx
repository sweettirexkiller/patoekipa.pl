'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface Project {
  image: string
  title: string
  subtitle: string
  androidLink?: string
  iosLink?: string
  webLink?: string
}

const workProjects: Project[] = [
  {
    image: '/shared/assets/projects/w01.png',
    title: 'English Brain Craft',
    subtitle: 'This is an English learning app for students to learn English through various methods.',
    androidLink: 'https://play.google.com/store/apps/details?id=kr.co.evolcano.donotstudy',
    iosLink: 'https://apps.apple.com/kr/app/%EC%98%81%EC%96%B4%EB%A8%B8%EB%A6%AC-%EA%B3%B5%EC%9E%91%EC%86%8C/id1507102714',
  },
  {
    image: '/shared/assets/projects/w02.png',
    title: 'Online Shop Web App',
    subtitle: 'This is a responsive online shop web application for car engine oil.',
    webLink: 'https://www.elo.best',
  },
  {
    image: '/shared/assets/projects/w03.jpeg',
    title: 'Advertisement Management System',
    subtitle: 'This is an Advertisement Management System to buy, sell, and manage advertisement.',
    webLink: 'https://www.externally.unavailable.project',
  },
]

const hobbyProjects: Project[] = [
  {
    image: '/shared/assets/projects/1.png',
    title: 'English Learning App',
    subtitle: 'This is a comprehensive English learning app for practicing and competing with each other.',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohatech.eduza',
  },
  {
    image: '/shared/assets/projects/02.png',
    title: 'English Dictionary App',
    subtitle: 'This is a dictionary application for English learners to easily look up word definitions.',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohatech.eduza_eng_dictionary',
    iosLink: 'https://apps.apple.com/us/app/eduza-english-dictionary/id6443770339',
  },
  {
    image: '/shared/assets/projects/03.png',
    title: 'Pocket Dictionary',
    subtitle: 'This is a word memorising app to save and play your own words as quizes',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohruhak.eng_pocket_dictionary',
    iosLink: 'https://apps.apple.com/tr/app/pocket-dictionary-1/id6447465115'
  },
  {
    image: '/shared/assets/projects/04.png',
    title: 'Tasbeeh Counter',
    subtitle: 'This is a simple dzikr counter app for muslims with persistent storage',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohatech.tasbeeh',
  },
  {
    image: '/shared/assets/projects/05.png',
    title: 'Todo App',
    subtitle: 'This is a simple task management app with persistent storage',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohatech.todo',
    iosLink: 'https://apps.apple.com/us/app/eduza-todo/id6443970333',
  },
  {
    image: '/shared/assets/projects/06.png',
    title: 'NotePad App',
    subtitle: 'This is a note taking app for MacOS and Android',
    androidLink: 'https://play.google.com/store/apps/details?id=com.shohatech.notepad',
    iosLink: 'https://apps.apple.com/us/app/eduza-notepad/id6443973859',
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div 
      className="group glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up border border-white/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:gradient-text transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Web
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
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
            Nasze{' '}
            <span className="gradient-text">
              Projekty
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Poznaj aplikacje i systemy, które stworzyliśmy dla naszych klientów i jako projekty hobbystyczne
          </p>
        </div>

        {/* Work Projects */}
        <div className="mb-24">
          <h3 className={`text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Projekty Komercyjne
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {workProjects.map((project, index) => (
              <div
                key={project.title}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Hobby Projects */}
        <div>
          <h3 className={`text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Projekty Hobbystyczne
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {hobbyProjects.map((project, index) => (
              <div
                key={project.title}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 3) * 200}ms` }}
              >
                <ProjectCard project={project} index={index + 3} />
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
              Masz pomysł na projekt?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Skontaktuj się z nami i przekształćmy Twój pomysł w rzeczywistość
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