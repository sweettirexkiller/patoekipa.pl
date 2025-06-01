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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="group glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Section */}
      <div className="relative h-72 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="glass px-4 py-2 rounded-full border border-white/20">
            <span className="text-sm font-semibold text-white">
              {member.role}
            </span>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute bottom-6 left-6 w-2 h-2 bg-white/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-white/50 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Name */}
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:gradient-text transition-all duration-300">
          {member.name}
        </h3>

        {/* Bio */}
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed line-clamp-3">
          {member.bio}
        </p>

        {/* Skills */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {member.skills.slice(0, 4).map((skill, skillIndex) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-xl font-medium border border-blue-100 dark:border-blue-800/30 hover:scale-105 transition-transform duration-200"
                style={{ animationDelay: `${skillIndex * 100}ms` }}
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 4 && (
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-xl font-medium">
                +{member.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {/* Portfolio Link */}
          <a
            href={member.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center group/btn"
          >
            <span className="flex items-center justify-center gap-2">
              Portfolio
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </a>

          {/* Social Links */}
          <a
            href={member.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group/social border border-white/10"
            title="GitHub"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover/social:text-slate-800 dark:group-hover/social:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
          </a>

          <a
            href={member.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group/social border border-white/10"
            title="LinkedIn"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover/social:text-slate-800 dark:group-hover/social:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
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
    <section id="team" ref={sectionRef} className="py-24 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Nasz Zespół
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Poznaj{' '}
            <span className="gradient-text">
              {teamData.team.name}
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {teamData.team.description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
          {teamData.members.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Gotowi na współpracę?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Skontaktuj się z nami i porozmawiajmy o Twoim projekcie
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