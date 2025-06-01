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
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
          {project.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {project.subtitle}
        </p>
        
        <div className="flex space-x-3">
          {project.androidLink && (
            <a
              href={project.androidLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <span>Android</span>
            </a>
          )}
          {project.iosLink && (
            <a
              href={project.iosLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <span>iOS</span>
            </a>
          )}
          {project.webLink && (
            <a
              href={project.webLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <span>Web</span>
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
    <section id="projects" ref={sectionRef} className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto">
        {/* Work Projects */}
        <div className="mb-20">
          <h2 className={`text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Projekty
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          <h2 className={`text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Hobbystyczne
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {hobbyProjects.map((project, index) => (
              <div
                key={project.title}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + workProjects.length) * 200}ms` }}
              >
                <ProjectCard project={project} index={index + workProjects.length} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 