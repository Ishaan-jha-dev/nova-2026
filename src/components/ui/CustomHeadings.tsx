'use client'

import React from 'react'

/**
 * Custom Stylized Headings
 * Uses pure HTML/CSS for perfect font rendering and positioning,
 * with inline SVG flourishes for the elegant, botanical aesthetic.
 */

export function ExploreEventsHeading() {
  return (
    <div className="relative inline-flex flex-col items-center justify-center mb-4 mt-2">
      <div className="relative z-10 flex items-center gap-4">
        {/* Left flourish */}
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="opacity-70">
          <path d="M 40 10 Q 20 10 10 0 Q 15 15 0 20 Q 20 15 40 10" fill="#E8A020" />
        </svg>

        <h1 className="text-5xl md:text-6xl text-white drop-shadow-md flex items-center gap-3">
          <span className="font-serif italic font-black tracking-wide uppercase">Explore</span>
          <span className="font-handwritten normal-case text-[#E8A020] text-[1.1em] rotate-[-2deg] inline-block filter drop-shadow-[0_2px_8px_rgba(232,160,32,0.3)] relative">
            Events
            {/* Top right sparkle */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="absolute -top-3 -right-5 opacity-80">
              <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0" fill="#FBBF24" />
            </svg>
          </span>
        </h1>

        {/* Right flourish */}
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="opacity-70 scale-x-[-1]">
          <path d="M 40 10 Q 20 10 10 0 Q 15 15 0 20 Q 20 15 40 10" fill="#E8A020" />
        </svg>
      </div>

      {/* Bottom curved underline */}
      <svg width="200" height="15" viewBox="0 0 200 15" fill="none" className="mt-2 opacity-50">
        <path d="M 0 5 Q 100 20 200 5" stroke="url(#gold-grad-explore)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <defs>
          <linearGradient id="gold-grad-explore" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8A020" stopOpacity="0" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="100%" stopColor="#E8A020" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function LiveUpdatesHeading() {
  return (
    <div className="relative inline-flex flex-col items-center justify-center mb-4 mt-2">
      <h1 className="text-5xl md:text-6xl text-white drop-shadow-md flex items-center gap-3 relative z-10">
        <span className="font-serif italic font-black tracking-wide uppercase relative">
          L
          {/* Custom "i" with spark dot */}
          <span className="inline-flex flex-col items-center mx-[2px] relative -top-1">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="mb-1 text-[#FBBF24] animate-pulse">
              <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0" fill="currentColor" />
            </svg>
            <span>i</span>
          </span>
          ve
        </span>
        <span className="font-handwritten normal-case text-[#E8A020] text-[1.1em] rotate-[-2deg] inline-block filter drop-shadow-[0_2px_8px_rgba(232,160,32,0.3)]">
          Updates
        </span>
      </h1>
      
      {/* Swoosh accent underneath */}
      <svg width="150" height="12" viewBox="0 0 150 12" fill="none" className="absolute -bottom-2 right-4 opacity-60">
        <path d="M 0 10 Q 75 -5 150 10" stroke="#E8A020" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function YourProfileHeading() {
  return (
    <div className="relative inline-flex flex-col items-center justify-center mb-4 mt-2">
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl text-white drop-shadow-md flex items-center gap-4">
          <span className="font-handwritten normal-case text-[#E8A020] text-[1.15em] rotate-[-4deg] inline-block filter drop-shadow-[0_2px_8px_rgba(232,160,32,0.3)] mt-2">
            Your
          </span>
          <span className="font-serif italic font-black tracking-widest uppercase relative">
            Profile
            
            {/* Minimalist leaf sprig wrapped around the 'E' */}
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" className="absolute -right-8 -top-3 opacity-80 pointer-events-none">
              <path d="M 5 35 Q 25 20 20 0" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
              <path d="M 17 15 Q 25 10 28 15 Q 25 20 17 15" fill="#E8A020" opacity="0.8" />
              <path d="M 12 25 Q 5 20 5 25 Q 8 30 12 25" fill="#E8A020" opacity="0.6" />
            </svg>
          </span>
        </h1>
      </div>
    </div>
  )
}

/* ─── Spinning Pinwheel O ─────────────────────── */
function PinwheelO() {
  return (
    <span 
      className="relative inline-flex items-center justify-center" 
      style={{ 
        width: '1em', 
        height: '1em',
        transform: 'translateY(-0.02em)' // Optical correction
      }}
    >
      <span style={{ opacity: 0, userSelect: 'none', fontSize: 'inherit' }}>O</span>
      <svg
        viewBox="0 0 100 100"
        className="nova-pinwheel"
        style={{
          position: 'absolute',
          width: '0.82em',
          height: '0.82em',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i} transform={`rotate(${(i * 360) / 14} 50 50)`}>
            <polygon
              points="50,50 44,8 56,8"
              fill={i % 2 === 0 ? '#FBBF24' : '#ffffff'}
              fillOpacity={i % 2 === 0 ? 0.95 : 0.75}
            />
          </g>
        ))}
        <circle cx="50" cy="50" r="7" fill="#FBBF24" />
        <circle cx="50" cy="50" r="3.5" fill="#fff" />
      </svg>
    </span>
  )
}

export function WelcomeBackHeading() {
  return (
    <div className="relative flex flex-row flex-wrap items-center justify-center w-full mt-2 mb-6 gap-x-4 gap-y-2">
      {/* Welcome to */}
      <span className="font-serif italic text-white/80 text-3xl md:text-5xl font-light tracking-wide mr-2">
        Welcome to
      </span>

      {/* NOVA */}
      <div className="flex items-center text-5xl md:text-7xl text-white font-serif font-black tracking-widest uppercase">
        <span>N</span>
        <div className="relative inline-flex items-center justify-center mx-[2px] w-[0.85em] h-[0.85em] animate-[spin_60s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {Array.from({ length: 14 }).map((_, i) => (
              <g key={i} transform={`rotate(${(i * 360) / 14} 50 50)`}>
                <polygon
                  points="50,50 44,8 56,8"
                  fill={i % 2 === 0 ? '#FBBF24' : '#E5E7EB'}
                  fillOpacity={i % 2 === 0 ? 0.95 : 0.8}
                />
              </g>
            ))}
            <circle cx="50" cy="50" r="7" fill="#FBBF24" />
            <circle cx="50" cy="50" r="3.5" fill="#fff" />
          </svg>
        </div>
        <span>VA</span>
      </div>

      {/* Unplugged '26 */}
      <div className="flex items-baseline text-4xl md:text-6xl font-serif italic text-[#E8A020] tracking-wider drop-shadow-[0_2px_8px_rgba(232,160,32,0.3)] mt-1">
        <span className="font-semibold">Unplugged</span>
        <span className="font-black ml-2">'26</span>
      </div>
    </div>
  )
}
