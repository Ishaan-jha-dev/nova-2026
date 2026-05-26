import React from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  titleHighlight?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: React.CSSProperties
}

export function PageWrapper({
  children,
  title,
  subtitle,
  titleHighlight,
  maxWidth = 'xl',
  className = '',
  style,
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
      className={`min-h-screen w-full relative overflow-x-hidden overflow-y-auto flex justify-center pt-14 pb-14 text-white bg-nova-hero ${className}`}
      style={style}
    >
      <div className={`w-full ${widthClasses[maxWidth]} px-6 relative z-10 flex flex-col`}>
        {/* Render Title header if provided */}
        {(title || titleHighlight) && (
          <div className="text-center mb-6 animate-fade-in select-none">
            <h1 className="text-5xl md:text-6xl text-white drop-shadow-md flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {title && (
                <span className="font-serif italic font-black tracking-wide uppercase">
                  {title}
                </span>
              )}
              {titleHighlight && (
                <span className="font-handwritten normal-case text-[#E8A020] text-5xl md:text-6xl rotate-[-2deg] inline-block filter drop-shadow-[0_2px_8px_rgba(232,160,32,0.2)]">
                  {titleHighlight}
                </span>
              )}
            </h1>
            {subtitle && (
              <p className="text-white/50 font-medium mt-2 uppercase tracking-widest text-xs">
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
