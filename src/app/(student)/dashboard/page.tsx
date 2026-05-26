import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatIST } from '@/lib/utils/dateUtils'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { ArrowRight, Megaphone, Lock, Calendar, ChevronRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

// ── Decorative SVG Mandala (top-left / top-right corner) ──────────────────────
function MandalaConer({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-36 md:w-52 lg:w-64 opacity-25 pointer-events-none select-none ${flip ? 'scale-x-[-1]' : ''}`}
    >
      {/* outer petals */}
      {[0,45,90,135,180,225,270,315].map((deg) => (
        <ellipse key={deg} cx="100" cy="100" rx="80" ry="18"
          fill="none" stroke="#E8A020" strokeWidth="0.8"
          transform={`rotate(${deg} 100 100)`} />
      ))}
      {/* mid petals */}
      {[0,60,120,180,240,300].map((deg) => (
        <ellipse key={deg} cx="100" cy="100" rx="55" ry="12"
          fill="#E8A020" fillOpacity="0.12" stroke="#E8A020" strokeWidth="0.6"
          transform={`rotate(${deg} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="40" fill="none" stroke="#E8A020" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="22" fill="none" stroke="#E8A020" strokeWidth="1" />
      <circle cx="100" cy="100" r="8" fill="#E8A020" fillOpacity="0.4" />
      {/* dots at petal tips */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = 80
        const rad = (deg * Math.PI) / 180
        return <circle key={i} cx={100 + r * Math.cos(rad)} cy={100 + r * Math.sin(rad)} r="2.5" fill="#E8A020" fillOpacity="0.5" />
      })}
    </svg>
  )
}

// ── Small decorative diamond divider ─────────────────────────────────────────
function DiamondDivider({ color = '#E8A020' }: { color?: string }) {
  return (
    <div className="flex items-center gap-2 justify-center my-2">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}60)` }} />
      <svg viewBox="0 0 16 16" width="10" height="10" fill={color} className="opacity-60"><rect x="4" y="0" width="8" height="8" rx="1" transform="rotate(45 8 4)" /></svg>
      <svg viewBox="0 0 16 16" width="14" height="14" fill={color}><rect x="3" y="0" width="10" height="10" rx="1" transform="rotate(45 8 5)" /></svg>
      <svg viewBox="0 0 16 16" width="10" height="10" fill={color} className="opacity-60"><rect x="4" y="0" width="8" height="8" rx="1" transform="rotate(45 8 4)" /></svg>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}60)` }} />
    </div>
  )
}

// ── Numbered bubble above each card ──────────────────────────────────────────
function NumberBubble({ n, color }: { n: string; color: string }) {
  return (
    <div
      className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 shadow-lg"
      style={{
        background: color,
        borderColor: `${color}99`,
        boxShadow: `0 0 20px ${color}55`,
        color: '#fff',
      }}
    >
      {n}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: _userData }, { data: _registrations }, { data: _announcements }] = await Promise.all([
    supabase.from('users').select('*, user_roles(name, permissions_level)').eq('id', user.id).single(),
    supabase.from('registrations').select('*, events(title, category_id, event_date, start_time, participation_type, categories(title))').eq('user_id', user.id).limit(3),
    supabase.from('announcements').select('*, users(full_name)').order('created_at', { ascending: false }).limit(3),
  ])

  const userData = _userData as any
  const registrations = _registrations as any[] | null
  const announcements = _announcements as any[] | null
  const isApproved = userData?.payment_status === 'approved'

  const FEST_DATE = '2026-06-15T00:00:00+05:30'

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex flex-col items-center text-white"
      style={{
        background: 'linear-gradient(160deg, #0a0500 0%, #1a0800 30%, #130d02 60%, #0a0500 100%)',
      }}
    >
      {/* ── Background star-field dots ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #E8A02055 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Silhouette city / temple line at bottom ──────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 96 L0 60 L40 60 L40 40 L50 40 L50 20 L60 20 L60 40 L70 40 L70 60
            L120 60 L120 50 L160 50 L160 30 L165 30 L165 10 L170 10 L170 30 L175 30 L175 50
            L220 50 L220 60 L280 60 L280 40 L290 25 L295 15 L300 25 L310 40 L310 60
            L380 60 L380 50 L420 50 L420 35 L430 20 L440 35 L440 50 L480 50 L480 60
            L560 60 L560 45 L600 45 L600 30 L610 15 L615 5 L620 15 L630 30 L630 45
            L680 45 L680 60 L720 60 L720 50 L760 50 L760 35 L770 20 L780 35 L780 50
            L820 50 L820 60 L900 60 L900 40 L910 25 L920 25 L920 40 L960 40 L960 60
            L1040 60 L1040 50 L1080 50 L1080 30 L1090 15 L1095 5 L1100 15 L1110 30
            L1110 50 L1160 50 L1160 60 L1240 60 L1240 40 L1250 25 L1260 40 L1260 60
            L1340 60 L1340 50 L1380 50 L1380 65 L1440 65 L1440 96 Z" fill="#E8A020"/>
        </svg>
      </div>

      {/* ── Mandala corners ──────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 pointer-events-none -translate-x-8 -translate-y-8">
        <MandalaConer />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none translate-x-8 -translate-y-8">
        <MandalaConer flip />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full text-center pt-20 pb-6 px-4">
        {/* Star dots */}
        <div className="absolute top-6 left-1/4 w-1.5 h-1.5 rounded-full bg-[#E8A020] opacity-70 animate-pulse" />
        <div className="absolute top-10 right-1/3 w-1 h-1 rounded-full bg-[#E8A020] opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-8 right-1/4 w-1.5 h-1.5 rounded-full bg-[#E8A020] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />

        <p
          className="text-lg md:text-xl mb-1 font-light tracking-wider"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#E8A020' }}
        >
          Welcome to
        </p>
        <h1 className="leading-none flex flex-wrap items-baseline justify-center gap-x-4">
          <span
            className="font-black uppercase tracking-widest text-white"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            NOVA
          </span>
          <span
            className="font-bold uppercase tracking-wider"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #FBBF24, #E8A020, #D97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            UNPLUGGED &apos;26
          </span>
        </h1>

        {/* Gold line separator */}
        <div className="flex items-center gap-3 justify-center mt-4">
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to right, transparent, #E8A020)' }} />
          <svg viewBox="0 0 20 20" width="14" height="14" fill="#E8A020">
            <polygon points="10,1 12,7 19,7 13,11 15,18 10,14 5,18 7,11 1,7 8,7" />
          </svg>
          <svg viewBox="0 0 20 20" width="10" height="10" fill="#E8A020" className="opacity-60">
            <polygon points="10,2 11,7 17,7 12,10 14,16 10,13 6,16 8,10 3,7 9,7" />
          </svg>
          <svg viewBox="0 0 20 20" width="14" height="14" fill="#E8A020">
            <polygon points="10,1 12,7 19,7 13,11 15,18 10,14 5,18 7,11 1,7 8,7" />
          </svg>
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to left, transparent, #E8A020)' }} />
        </div>
      </header>

      {/* ── Cards Grid ───────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1300px] px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 items-start">

        {/* ── CARD 01: MY EVENTS ──────────────────────────────────────────── */}
        <div className="relative pt-6">
          <NumberBubble n="01" color="#C0621A" />
          <Link
            href="/dashboard/events"
            className="block rounded-2xl p-6 h-full flex flex-col items-center group transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #3B1005 0%, #1E0A02 100%)',
              border: '1px solid #C0621A55',
              boxShadow: '0 8px 40px rgba(192, 98, 26, 0.2)',
            }}
          >
            {/* title */}
            <h2 className="font-black text-xl uppercase tracking-[0.2em] text-white mt-2 mb-2 text-center">
              My Events
            </h2>

            {/* badge */}
            <div
              className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5"
              style={{ background: '#C0621A', color: '#fff' }}
            >
              Registered: {registrations ? registrations.length : 0} Events
            </div>

            {/* content */}
            <div className="w-full flex-1 flex flex-col items-center">
              {registrations && registrations.length > 0 ? (
                <ul className="w-full space-y-3">
                  {registrations.map(reg => {
                    const ev = reg.events as any
                    return (
                      <li
                        key={reg.id}
                        className="rounded-xl p-3 flex items-start justify-between transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #C0621A30' }}
                      >
                        <div>
                          <p className="font-black text-xs uppercase text-white">{ev?.title}</p>
                          <p className="text-white/50 text-[10px] mt-0.5">
                            {ev?.event_date ? `${ev.event_date}${ev.start_time ? ` · ${ev.start_time}` : ''}` : 'Date TBD'}
                          </p>
                        </div>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded" style={{ background: '#C0621A22', color: '#C0621A', border: '1px solid #C0621A55' }}>
                          {ev?.categories?.title || 'Event'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-10">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ border: '1.5px solid #C0621A55', background: '#C0621A15' }}
                  >
                    <Calendar size={26} style={{ color: '#C0621A' }} />
                  </div>
                  <p className="font-bold text-white/40 uppercase tracking-widest text-xs text-center">
                    No Events Registered
                  </p>
                </div>
              )}
            </div>

            {/* CTA button */}
            <div className="w-full mt-6">
              <div
                className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black uppercase tracking-widest text-xs transition-all duration-300 group-hover:gap-4"
                style={{
                  background: 'linear-gradient(90deg, #C0621A, #E8840A)',
                  boxShadow: '0 0 20px rgba(192,98,26,0.4)',
                  color: '#fff',
                }}
              >
                Explore All Events <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        </div>

        {/* ── MIDDLE COLUMN: Cards 02 + 03 ─────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* CARD 02: LIVE UPDATES */}
          <div className="relative pt-6">
            <NumberBubble n="02" color="#1A6B7A" />
            <Link
              href="/dashboard/announcements"
              className="block rounded-2xl p-6 flex flex-col group transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(160deg, #052830 0%, #021318 100%)',
                border: '1px solid #1A6B7A55',
                boxShadow: '0 8px 40px rgba(26, 107, 122, 0.2)',
              }}
            >
              <h2 className="font-black text-lg uppercase tracking-[0.2em] text-white mt-2 mb-1 text-center">
                ✦ Live Updates ✦
              </h2>
              <DiamondDivider color="#1A6B7A" />

              <div className="flex-1 mt-3 space-y-3">
                {announcements && announcements.length > 0 ? (
                  announcements.map(ann => (
                    <div
                      key={ann.id}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(26,107,122,0.15)', border: '1px solid #1A6B7A30' }}
                    >
                      <Megaphone size={16} className="shrink-0 mt-0.5" style={{ color: '#1A9BAA' }} />
                      <p className="text-white/80 text-xs leading-snug font-medium">{ann.title}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(26,107,122,0.15)', border: '1px solid #1A6B7A30' }}
                  >
                    <Megaphone size={16} className="shrink-0 mt-0.5" style={{ color: '#1A9BAA' }} />
                    <p className="text-white/70 text-xs leading-snug">Welcome to Nova Unplugged &apos;26!</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 mt-4 font-black uppercase tracking-widest text-[10px] transition-all group-hover:gap-2" style={{ color: '#1A9BAA' }}>
                View All Announcements <ChevronRight size={13} />
              </div>
            </Link>
          </div>

          {/* CARD 03: COUNTDOWN */}
          <div className="relative pt-6">
            <NumberBubble n="03" color="#6B2B9A" />
            <div
              className="block rounded-2xl p-6 flex flex-col items-center"
              style={{
                background: 'linear-gradient(160deg, #1E0835 0%, #0D0220 100%)',
                border: '1px solid #6B2B9A55',
                boxShadow: '0 8px 40px rgba(107, 43, 154, 0.2)',
              }}
            >
              <h2 className="font-black text-lg uppercase tracking-[0.2em] text-white mt-2 mb-1 text-center">
                ✦ Countdown ✦
              </h2>
              <DiamondDivider color="#6B2B9A" />

              <div
                className="w-full rounded-2xl py-6 px-4 mt-3 flex items-center justify-center"
                style={{ background: 'rgba(107,43,154,0.12)', border: '1px solid #6B2B9A30' }}
              >
                <CountdownTimer targetDate={FEST_DATE} />
              </div>

              {/* Taj silhouette below countdown */}
              <svg viewBox="0 0 300 60" className="w-full opacity-20 mt-2" fill="#6B2B9A">
                <path d="M0 60 L0 35 L20 35 L20 25 L30 25 L30 15 L35 15 L35 5 L37 5 L37 15 L40 15 L40 25 L50 25 L50 35 L70 35 L70 30 L100 30 L100 20 L110 10 L115 0 L120 10 L130 20 L130 30 L160 30 L160 20 L170 10 L175 0 L180 10 L190 20 L190 30 L220 30 L220 35 L240 35 L250 25 L260 25 L260 15 L263 15 L263 5 L265 5 L265 15 L270 15 L270 25 L280 25 L280 35 L300 35 L300 60 Z"/>
              </svg>
            </div>
          </div>

        </div>

        {/* ── CARD 04: DIGITAL GATE PASS ────────────────────────────────── */}
        <div className="relative pt-6">
          <NumberBubble n="04" color="#8C7A0A" />
          <div
            className="rounded-2xl p-6 flex flex-col items-center h-full transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #2A2100 0%, #151000 100%)',
              border: '1px solid #8C7A0A55',
              boxShadow: '0 8px 40px rgba(140, 122, 10, 0.2)',
            }}
          >
            <h2 className="font-black text-xl uppercase tracking-[0.18em] text-white mt-2 mb-1 text-center">
              ✦ Digital Gate Pass ✦
            </h2>
            <DiamondDivider color="#E8A020" />

            {isApproved && userData?.entry_code ? (
              <Link href="/profile" className="w-full flex flex-col items-center flex-1 mt-2">
                {/* QR */}
                <div className="w-full flex justify-center mb-4 transition-transform hover:scale-[1.02]">
                  <QRDisplay
                    value={userData.entry_code}
                    size={200}
                    downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                  />
                </div>

                {/* Info strip */}
                <div
                  className="w-full rounded-xl p-4 mt-auto border"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: '#E8A02030' }}
                >
                  <p className="font-black text-sm uppercase text-white leading-tight mb-0.5">{userData?.full_name}</p>
                  <p className="text-white/50 text-xs truncate mb-3">{userData?.email}</p>
                  <div className="flex justify-between items-center gap-2">
                    <span
                      className="text-[10px] font-black uppercase px-3 py-1 rounded-lg flex-1 text-center"
                      style={{ background: '#E8A02015', color: '#E8A020', border: '1px solid #E8A02030' }}
                    >
                      {userData?.batch || 'Batch TBD'}
                    </span>
                    <span
                      className="text-[10px] font-black uppercase px-3 py-1 rounded-lg flex-1 text-center"
                      style={{ background: '#E8A02015', color: '#E8A020', border: '1px solid #E8A02030' }}
                    >
                      {userData?.zone || 'Zone TBD'}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center flex-1 mt-4 w-full">
                <div
                  className="w-full flex-1 rounded-xl flex flex-col items-center justify-center py-10 mb-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #E8A02020' }}
                >
                  <Lock size={38} style={{ color: '#E8A020' }} className="mb-3 animate-pulse" />
                  <p className="font-black text-base uppercase tracking-wider text-white/90 mb-2">Pass Locked</p>
                  <p className="text-white/50 text-xs text-center max-w-[170px]">Complete payment to unlock your digital gate pass</p>
                </div>
                <Link
                  href="/payment"
                  className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black uppercase tracking-widest text-xs transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #8C7A0A, #E8A020)',
                    boxShadow: '0 0 20px rgba(232,160,32,0.3)',
                    color: '#fff',
                  }}
                >
                  Go to Payment <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
