'use client'

import { useState, useEffect, useRef } from 'react'
import { ProfileCard } from './react-bits'

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
  // Define glow colors for each member
  const glowColors = [
    'rgba(59, 130, 246, 0.6)',   // blue
    'rgba(139, 92, 246, 0.6)',   // purple  
    'rgba(236, 72, 153, 0.6)',   // pink
    'rgba(6, 182, 212, 0.6)',    // cyan
  ]

  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <ProfileCard
        name={member.name}
        role={member.role}
        bio={member.bio}
        skills={member.skills}
        avatar={member.avatar}
        portfolioUrl={member.portfolioUrl}
        social={member.social}
        glowColor={glowColors[index % glowColors.length]}
        className="h-full"
      />
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