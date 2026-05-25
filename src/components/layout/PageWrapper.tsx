import React from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  titleHighlight?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function PageWrapper({
  children,
  title,
  subtitle,
  titleHighlight,
  maxWidth = 'xl',
  className = '',
}: PageWrapperProps) {
  // Width styling mapping
  const widthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-[1300px]',
  }

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden overflow-y-auto flex justify-center pt-28 pb-20 text-white ${className}`}
      style={{
        backgroundColor: '#0c0d10',
        backgroundImage: `radial-gradient(circle at center, #2a2b30 1.5px, transparent 1.5px)`,
        backgroundSize: '36px 36px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Decorative Dashed Path (Mind-map vibe matching Dashboard) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 200 Q 400 50, 700 300 T 1300 150"
          fill="transparent"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="8 8"
        />
      </svg>

      <div className={`w-full ${widthClasses[maxWidth]} px-6 relative z-10 flex flex-col`}>
        {/* Render Title header if provided */}
        {(title || titleHighlight) && (
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-wider text-white drop-shadow-md">
              {title}{' '}
              {titleHighlight && (
                <span className="text-[#FF3366]">{titleHighlight}</span>
              )}
            </h1>
            {subtitle && (
              <p className="text-white/50 font-medium mt-3 uppercase tracking-widest text-sm">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
