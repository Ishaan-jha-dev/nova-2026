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
      className={`min-h-screen w-full relative overflow-x-hidden overflow-y-auto flex justify-center pt-28 pb-20 text-white bg-nova-hero ${className}`}
    >
      <div className={`w-full ${widthClasses[maxWidth]} px-6 relative z-10 flex flex-col`}>
        {/* Render Title header if provided */}
        {(title || titleHighlight) && (
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-wider text-white drop-shadow-md">
              {title}{' '}
              {titleHighlight && (
                <span className="text-[#E8A020]">{titleHighlight}</span>
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
