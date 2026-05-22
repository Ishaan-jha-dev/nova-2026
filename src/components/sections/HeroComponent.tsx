'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ParticleCrowd from '@/components/ui/ParticleCrowd'
import { createClient } from '@/lib/supabase/client'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { Modal } from '@/components/ui/Modal'

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

/* ─── Main Page ───────────────────────────────── */
export default function HeroComponent() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #2d0a1a 0%, #1c0505 45%, #0A0105 100%)' }}
    >
      {/* Particles */}
      <ParticleCrowd />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          zIndex: 4,
          transform: 'translateX(-50%)',
          width: '70vw', height: '35vh',
          background: 'radial-gradient(ellipse at bottom, rgba(232,61,138,0.28) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── Branding ──────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center" style={{ zIndex: 20 }}>

        {/* Top label */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.3vw, 0.85rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(251,191,36,0.65)',
            marginBottom: '0.8rem',
            opacity: 0,
            animation: 'fadeSlideUp 0.7s 0.1s ease forwards',
          }}
        >
          Annual Campus Immersion Programme
        </p>

        {/* NOVA */}
        <div className="nova-word flex items-center" style={{ gap: '0.02em', lineHeight: 1 }}>
          <span className="nova-letter-char" style={{ animationDelay: '0.2s' }}>N</span>
          <PinwheelO />
          <span className="nova-letter-char" style={{ animationDelay: '0.35s' }}>V</span>
          <span className="relative nova-letter-char" style={{ animationDelay: '0.45s' }}>
            A<span className="nova-star-el">✦</span>
          </span>
        </div>

        {/* UNPLUGGED '26 */}
        <div className="flex items-baseline" style={{ gap: '0.04em', marginTop: '-0.05em' }}>
          {'UNPLUGGED'.split('').map((ch, i) => (
            <span
              key={i}
              className="unplugged-char"
              style={{
                animationDelay: `${0.55 + i * 0.05}s`,
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3.8vw, 3rem)',
                color: 'rgba(251,191,36,0.9)',
                letterSpacing: '0.06em',
              }}
            >
              {ch}
            </span>
          ))}
          <span
            className="unplugged-char"
            style={{
              animationDelay: `${0.55 + 9 * 0.05}s`,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4.2vw, 3.5rem)',
              color: '#FF3366',
              marginLeft: '0.15em',
              background: 'none',
              WebkitBackgroundClip: 'unset',
              backgroundClip: 'unset',
            }}
          >
            &apos;26
          </span>
        </div>

        {/* Details */}
        <div
          style={{
            opacity: 0,
            animation: 'fadeSlideUp 0.7s 1.1s ease forwards',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginTop: '0.6rem',
          }}
        >
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(0.6rem, 1.2vw, 0.78rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#FDA4AF',
          }}>
            BBA · DBE · IIM Bangalore
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.88)',
            textShadow: '0 0 20px rgba(232,61,138,0.5)',
          }}>
            June 15 – 18, 2026
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2.2rem', minHeight: '80px' }}>
          {!loading && (
            user ? (
              <Link href="/dashboard" className="glass-cta-btn">
                <span className="glass-cta-shine" />
                <span style={{ position: 'relative', zIndex: 1, fontWeight: 900, letterSpacing: '0.25em', fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)' }}>
                  ENTER TO NOVA!!
                </span>
              </Link>
            ) : (
              <>
                <Link href="/register" className="glass-cta-btn">
                  <span className="glass-cta-shine" />
                  <span style={{ position: 'relative', zIndex: 1, fontWeight: 900, letterSpacing: '0.25em', fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)' }}>
                    REGISTER NOW
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="text-nova-text-dim hover:text-nova-primary transition-colors duration-300"
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    marginTop: '1rem',
                    opacity: 0,
                    animation: 'fadeSlideUp 0.7s 1.3s ease forwards',
                  }}
                >
                  LOG IN
                </Link>
              </>
            )
          )}
        </div>
      </div>
      
      {/* Floating WhatsApp Button for queries */}
      <WhatsAppButton />

      {/* Stay Tuned WhatsApp Modal */}
      <Modal 
        open={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)}
        title="Stay Tuned!"
        size="md"
      >
        <div className="flex flex-col items-center text-center space-y-6 py-2">
          {/* WhatsApp Icon with green pulse */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 animate-pulse animate-duration-2000">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12.031 2c-5.517 0-9.997 4.48-9.997 9.997 0 1.763.459 3.483 1.33 5.002L2 22l5.163-1.355a9.96 9.96 0 0 0 4.868 1.252h.004c5.517 0 9.996-4.48 9.996-9.997 0-2.67-1.037-5.178-2.923-7.068C17.22 3.037 14.71 2 12.031 2zm6.39 14.22c-.279.79-1.397 1.448-1.921 1.549-.475.093-1.096.166-3.13-.675-2.6-1.074-4.246-3.738-4.376-3.91-.129-.172-1.05-1.398-1.05-2.667 0-1.27.665-1.894.901-2.147.236-.253.515-.316.687-.316.171 0 .343.001.492.008.156.007.367-.06.574.453.21.52.72 1.758.783 1.89.063.13.104.283.018.455-.086.171-.129.278-.258.428-.129.15-.27.336-.386.452-.129.129-.264.27-.113.528.15.258.666 1.098 1.428 1.776.982.873 1.808 1.144 2.066 1.273.258.129.408.107.558-.069.15-.176.644-.75.815-1.008.172-.258.343-.215.58-.129.236.086 1.499.708 1.757.837.258.129.43.193.494.3.064.108.064.624-.215 1.414z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <p className="text-nova-text text-sm md:text-base leading-relaxed font-body">
              Nova Unplugged &apos;26 registrations and events are starting soon! Join the WhatsApp updates group to stay tuned for the latest announcements, registration deadlines, and schedule updates.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-4">
            <a
              href="https://chat.whatsapp.com/Kc5eCJjVk5gCGDbP7xDaWM?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] font-body"
              onClick={() => setShowUpdateModal(false)}
            >
              Join WhatsApp Group
            </a>
            <button
              onClick={() => setShowUpdateModal(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-nova-text-dim hover:text-nova-text text-sm font-semibold tracking-wider uppercase transition-colors font-body"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
