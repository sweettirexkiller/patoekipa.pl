'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  skills: string[]
  avatar: string
  portfolioUrl: string
  social: {
    github: string
    linkedin: string
  }
}

// Team data - in a real app, this would come from an API or shared data file
const teamData = {
  team: {
    name: "Patoekipa",
    description: "Grupa przyjaciół z dzieciństwa, która nadal utrzymuje kontakt oraz wszyscy z ekipy skończyli w IT."
  },
  members: [
    {
      id: "piotr",
      name: "Piotr Jankiewicz",
      role: "Full-Stack Developer",
      bio: "Pasjonat technologii mobilnych i webowych. Specjalizuje się w Flutter i React, tworzy aplikacje od koncepcji do wdrożenia.",
      skills: ["Flutter", "Dart", "React", "TypeScript", "Node.js", "Firebase", "PostgreSQL"],
      avatar: "/shared/assets/avatars/piotr.jpg",
      portfolioUrl: "https://piotr.patoekipa.pl",
      social: {
        github: "https://github.com/sweettirexkiller",
        linkedin: "https://linkedin.com/in/piotr-jankiewicz"
      }
    },
    {
      id: "member2", 
      name: "Michał Kowalski",
      role: "Backend Developer",
      bio: "Expert w architekturze systemów i bazach danych. Tworzy skalowalne rozwiązania backendowe z wykorzystaniem najnowszych technologii.",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Docker", "AWS", "Kubernetes"],
      avatar: "/shared/assets/avatars/michal.jpg",
      portfolioUrl: "https://michal.patoekipa.pl",
      social: {
        github: "https://github.com/michal-kowalski",
        linkedin: "https://linkedin.com/in/michal-kowalski"
      }
    },
    {
      id: "member3",
      name: "Anna Nowak",
      role: "Frontend Developer",
      bio: "Specjalistka od interfejsów użytkownika i doświadczeń użytkownika. Tworzy piękne i funkcjonalne aplikacje webowe.",
      skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Figma", "Next.js", "Nuxt.js"],
      avatar: "/shared/assets/avatars/anna.jpg",
      portfolioUrl: "https://anna.patoekipa.pl",
      social: {
        github: "https://github.com/anna-nowak",
        linkedin: "https://linkedin.com/in/anna-nowak"
      }
    },
    {
      id: "member4",
      name: "Tomasz Wiśniewski",
      role: "DevOps Engineer",
      bio: "Odpowiedzialny za infrastrukturę i automatyzację procesów. Zapewnia płynne działanie aplikacji w środowisku produkcyjnym.",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "GitLab CI", "Monitoring"],
      avatar: "/shared/assets/avatars/tomasz.jpg",
      portfolioUrl: "https://tomasz.patoekipa.pl",
      social: {
        github: "https://github.com/tomasz-wisniewski",
        linkedin: "https://linkedin.com/in/tomasz-wisniewski"
      }
    }
  ]
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div 
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Avatar Section */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Role Badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {member.role}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Name */}
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {member.name}
        </h3>

        {/* Bio */}
        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {member.bio}
        </p>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex space-x-3">
          {/* Portfolio Link */}
          <a
            href={member.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Portfolio
          </a>

          {/* Social Links */}
          <a
            href={member.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="GitHub"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
          </a>

          <a
            href={member.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="LinkedIn"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export function TeamSection() {
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
    <section id="team" ref={sectionRef} className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Poznaj Zespół
          </h2>
          <p className={`text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {teamData.team.description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamData.members.map((member, index) => (
            <div
              key={member.id}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <MemberCard member={member} index={index} />
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {teamData.members.length}
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              Członków zespołu
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              15+
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              Technologii
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              5+
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              Lat doświadczenia
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              ∞
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              Przyjaźń
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 