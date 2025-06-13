'use client'

import { useState, useRef, useEffect } from 'react'

interface ProfileCardProps {
  name: string
  role: string
  bio?: string
  skills?: string[]
  avatar?: string
  portfolioUrl?: string
  social?: {
    github?: string
    linkedin?: string
  }
  className?: string
  glowColor?: string
}

export function ProfileCard({
  name,
  role,
  bio,
  skills = [],
  avatar,
  portfolioUrl,
  social,
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.6)'
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ 
          x: Math.max(0, Math.min(100, x)), 
          y: Math.max(0, Math.min(100, y)) 
        })
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      return () => card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 50, y: 50 })
  }

  // Calculate 3D rotation based on mouse position
  const rotateX = (mousePosition.y - 50) * 0.2
  const rotateY = (mousePosition.x - 50) * -0.2

  return (
    <div className={`relative w-full ${className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .holographic-card {
          --mouse-x: ${mousePosition.x}%;
          --mouse-y: ${mousePosition.y}%;
          --rotate-x: ${rotateX}deg;
          --rotate-y: ${rotateY}deg;
          --glow-opacity: ${isHovered ? '1' : '0'};
          --glow-color: ${glowColor};
        }

        .holographic-card {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .card-glow {
          position: absolute;
          inset: -20px;
          background: 
            radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--glow-color) 0%, transparent 50%),
            conic-gradient(from 0deg at var(--mouse-x) var(--mouse-y), 
              #ff0080 0deg, 
              #ff8c00 60deg, 
              #40e0d0 120deg, 
              #9370db 180deg, 
              #ff1493 240deg, 
              #00ff7f 300deg, 
              #ff0080 360deg);
          border-radius: 24px;
          opacity: var(--glow-opacity);
          filter: blur(20px);
          transition: opacity 0.5s ease;
          z-index: -1;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 500px;
          background: 
            radial-gradient(circle at var(--mouse-x) var(--mouse-y), 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 30%, 
              transparent 70%),
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.95) 0%, 
              rgba(30, 41, 59, 0.9) 50%, 
              rgba(15, 23, 42, 0.95) 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
        }

        .card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            conic-gradient(from 0deg at var(--mouse-x) var(--mouse-y), 
              transparent 0deg, 
              rgba(255, 0, 128, 0.1) 60deg, 
              rgba(64, 224, 208, 0.1) 120deg, 
              rgba(147, 112, 219, 0.1) 180deg, 
              rgba(255, 20, 147, 0.1) 240deg, 
              rgba(0, 255, 127, 0.1) 300deg, 
              transparent 360deg),
            radial-gradient(circle at var(--mouse-x) var(--mouse-y), 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 50%);
          opacity: var(--glow-opacity);
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .card-shine {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(45deg, 
              transparent 30%, 
              rgba(255, 255, 255, 0.1) 50%, 
              transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .holographic-card:hover .card-shine {
          transform: translateX(100%);
        }

        .card-content {
          position: relative;
          z-index: 10;
          height: 100%;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .avatar-container {
          position: relative;
          margin: 0 auto 24px;
          width: 100px;
          height: 100px;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid rgba(15, 23, 42, 0.9);
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }

        .name-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .role-title {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(168, 85, 247, 0.8);
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bio-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 24px;
          flex: 1;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .skill-tag {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .skill-tag:hover {
          background: rgba(168, 85, 247, 0.2);
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateY(-2px);
        }

        .actions-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
        }

        .portfolio-button {
          flex: 1;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .portfolio-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .social-button {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .social-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          color: white;
          transform: translateY(-2px);
        }
      `}} />

      <div 
        className="holographic-card"
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-glow" />
        
        <div className="card-inner">
          <div className="card-shine" />
          
          <div className="card-content">
            <div className="avatar-container">
              <div className="avatar">
                {avatar ? (
                  <img src={avatar} alt={name} />
                ) : (
                  name.charAt(0)
                )}
              </div>
              <div className="online-indicator" />
            </div>

            <h3 className="name-title">{name}</h3>
            <p className="role-title">{role}</p>

            {bio && (
              <p className="bio-text">{bio}</p>
            )}

            {skills.length > 0 && (
              <div className="skills-container">
                {skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="skill-tag">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="actions-container">
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-button"
                >
                  Portfolio
                </a>
              )}
              
              {social?.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  title="GitHub"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  title="LinkedIn"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 