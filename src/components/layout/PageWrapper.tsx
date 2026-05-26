'use client'

import React, { useId } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  titleHighlight?: string
  headingComponent?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: React.CSSProperties
}

/** Golden starburst branch corner decoration — matches the reference design */
function StarburstCorner({ opacity = 0.5 }: { opacity?: number }) {
  // Central starburst with radiating branches and floating particles
  const arms = [0, 45, 90, 135, 180, 225, 270, 315]
  const subArms = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', opacity }} aria-hidden="true">
      <g fill="none" stroke="#E8A020">
        {/* Main radiating arms */}
        {arms.map(deg => {
          const rad = (deg * Math.PI) / 180
          const x2 = 150 + Math.cos(rad) * 130
          const y2 = 150 + Math.sin(rad) * 130
          return (
            <g key={deg}>
              <line x1="150" y1="150" x2={x2} y2={y2} strokeWidth="1.2" stroke="#E8A020" opacity="0.7" />
              {/* Branch tip diamond */}
              <rect
                x={x2 - 4} y={y2 - 4} width="8" height="8"
                transform={`rotate(45 ${x2} ${y2})`}
                fill="#E8A020" fillOpacity="0.5" strokeWidth="0"
              />
              {/* Mid-arm branch fork */}
              {[-25, 25].map(offset => {
                const forkRad = ((deg + offset) * Math.PI) / 180
                const mx = 150 + Math.cos(rad) * 75
                const my = 150 + Math.sin(rad) * 75
                const fx = mx + Math.cos(forkRad) * 30
                const fy = my + Math.sin(forkRad) * 30
                return <line key={offset} x1={mx} y1={my} x2={fx} y2={fy} strokeWidth="0.6" stroke="#E8A020" opacity="0.45" />
              })}
            </g>
          )
        })}

        {/* Sub-arms (shorter) */}
        {subArms.map(deg => {
          const rad = (deg * Math.PI) / 180
          return (
            <line key={deg}
              x1={150 + Math.cos(rad) * 20} y1={150 + Math.sin(rad) * 20}
              x2={150 + Math.cos(rad) * 80} y2={150 + Math.sin(rad) * 80}
              strokeWidth="0.6" stroke="#E8A020" opacity="0.35"
            />
          )
        })}

        {/* Concentric dotted rings */}
        <circle cx="150" cy="150" r="35" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.5" />
        <circle cx="150" cy="150" r="65" strokeWidth="0.4" strokeDasharray="2 8" opacity="0.35" />
        <circle cx="150" cy="150" r="95" strokeWidth="0.3" strokeDasharray="1 10" opacity="0.2" />

        {/* Center star */}
        <circle cx="150" cy="150" r="10" fill="#E8A020" fillOpacity="0.4" strokeWidth="1" stroke="#FBBF24" opacity="0.9" />
        <circle cx="150" cy="150" r="4" fill="#FBBF24" stroke="none" />

        {/* Floating particles / diamonds */}
        {[
          [60, 80], [90, 40], [200, 60], [240, 90],
          [70, 200], [50, 240], [210, 210], [250, 250],
          [130, 30], [170, 270], [30, 130], [270, 170],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx - 3} y={cy - 3} width="6" height="6"
            transform={`rotate(45 ${cx} ${cy})`}
            fill="#E8A020" fillOpacity="0.4" strokeWidth="0"
          />
        ))}
      </g>
    </svg>
  )
}

export function PageWrapper({
  children,
  title,
  subtitle,
  titleHighlight,
  headingComponent,
  maxWidth = 'xl',
  className = '',
  style,
}: PageWrapperProps) {
  const uid1 = 'tl'
  const uid2 = 'br'

  const widthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-[1300px]',
  }

  return (
    <div
      className={`min-h-screen w-full relative flex justify-center pt-14 pb-14 text-white ${className}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #2a1000 0%, #140800 40%, #0a0400 70%, #050200 100%)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* ── Fixed background layer (bypasses overflow clipping) ── */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      >
        {/* Starfield dots */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(232,160,32,0.3) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }} />

        {/* Bottom city silhouette */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} fill="#E8A020" fillOpacity="0.12">
            <path d="M0,80 L0,55 L30,55 L30,40 L38,40 L38,25 L42,25 L42,12 L44,12 L44,8 L46,8 L46,12 L48,12 L48,25 L52,25 L52,40 L60,40 L60,55 L100,55 L100,45 L140,45 L140,30 L148,15 L152,5 L156,15 L164,30 L164,45 L200,45 L200,55 L260,55 L260,42 L300,42 L300,28 L308,14 L312,4 L316,14 L324,28 L324,42 L360,42 L360,55 L420,55 L420,44 L460,44 L460,30 L468,18 L472,8 L476,18 L484,30 L484,44 L520,44 L520,55 L580,55 L580,45 L640,45 L640,30 L648,15 L652,5 L656,15 L664,30 L664,45 L700,45 L700,55 L740,55 L740,44 L780,44 L780,30 L788,16 L792,6 L796,16 L804,30 L804,44 L840,44 L840,55 L900,55 L900,42 L940,42 L940,28 L948,14 L952,4 L956,14 L964,28 L964,42 L1000,42 L1000,55 L1060,55 L1060,44 L1100,44 L1100,28 L1108,14 L1112,4 L1116,14 L1124,28 L1124,44 L1160,44 L1160,55 L1220,55 L1220,40 L1228,40 L1228,25 L1232,25 L1232,10 L1234,10 L1234,6 L1236,6 L1236,10 L1238,10 L1238,25 L1242,25 L1242,40 L1250,40 L1250,55 L1300,55 L1300,45 L1340,45 L1340,55 L1440,55 L1440,80 Z" />
          </svg>
        </div>

        {/* Top-left starburst */}
        <div style={{ position: 'absolute', top: '-5vmin', left: '-5vmin', width: '42vmin', height: '42vmin' }}>
          <StarburstCorner opacity={0.5} />
        </div>

        {/* Top-right starburst (mirror) */}
        <div style={{ position: 'absolute', top: '-5vmin', right: '-5vmin', width: '42vmin', height: '42vmin', transform: 'scaleX(-1)' }}>
          <StarburstCorner opacity={0.5} />
        </div>

        {/* Bottom-left starburst */}
        <div style={{ position: 'absolute', bottom: '-5vmin', left: '-5vmin', width: '36vmin', height: '36vmin', transform: 'scaleY(-1)', opacity: 0.35 }}>
          <StarburstCorner opacity={1} />
        </div>

        {/* Bottom-right starburst */}
        <div style={{ position: 'absolute', bottom: '-5vmin', right: '-5vmin', width: '36vmin', height: '36vmin', transform: 'scale(-1)', opacity: 0.35 }}>
          <StarburstCorner opacity={1} />
        </div>

        {/* Warm center glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw', height: '40vh',
          background: 'radial-gradient(ellipse, rgba(180,80,10,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Content ── */}
      <div className={`w-full ${widthClasses[maxWidth]} px-6 relative flex flex-col`} style={{ zIndex: 10, paddingTop: '3.5rem' }}>
        {(title || titleHighlight || headingComponent) && (
          <div className="text-center mb-6 animate-fade-in select-none">
            {headingComponent ? (
              headingComponent
            ) : (
              <h1 className="text-5xl md:text-6xl text-white drop-shadow-md flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {title && (
                  <span className="font-serif italic font-black tracking-wide uppercase">
                    {title}
                  </span>
                )}
                {titleHighlight && (
                  <span className="font-handwritten normal-case text-[#E8A020] text-5xl md:text-6xl rotate-[-2deg] inline-block filter drop-shadow-[0_2px_8px_rgba(232,160,32,0.25)]">
                    {titleHighlight}
                  </span>
                )}
              </h1>
            )}
            
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
