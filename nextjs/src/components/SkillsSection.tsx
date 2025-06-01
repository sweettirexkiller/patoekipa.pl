'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const platformItems = [
  {
    img: "android_icon.png",
    title: "Android Dev",
  },
  {
    img: "web_icon.png", 
    title: "Web Dev",
  },
  {
    img: "ios_icon.png",
    title: "iOS Dev",
  },
  {
    img: "desktop_icon.png",
    title: "Desktop Dev",
  }
]

const skillItems = [
  {
    img: "flutter.png",
    title: "Flutter",
  },
  {
    img: "dart.png",
    title: "Dart",
  },
  {
    img: "html5.png",
    title: "HTML5",
  },
  {
    img: "css3.png",
    title: "CSS3",
  },
  {
    img: "javascript.png",
    title: "JavaScript",
  },
  {
    img: "hugo.png",
    title: "Hugo",
  },
  {
    img: "docker.png",
    title: "Docker",
  },
  {
    img: "python.png",
    title: "Python",
  }
]

export function SkillsSection() {
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
    <section id="skills" ref={sectionRef} className="py-20 px-6">
      <div className="container mx-auto">
        {/* Platforms Section */}
        <div className="mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Platformy
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {platformItems.map((item, index) => (
              <div
                key={item.title}
                className={`group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={`/shared/assets/${item.img}`}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 text-center">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h2 className={`text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Technologie
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {skillItems.map((item, index) => (
              <div
                key={item.title}
                className={`group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={`/shared/assets/${item.img}`}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 text-center">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 