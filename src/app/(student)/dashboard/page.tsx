import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { ArrowLeft, Menu, Megaphone, Calendar, ArrowRight, Download, Lock } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

/** Intricate SVG Mandala from PageWrapper */
function MandalaCorner({ uid, opacity = 0.45 }: { uid: string; opacity?: number }) {
  const gradId = `mg-${uid}`
  const filterId = `glow-${uid}`

  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity }} aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="1" />
          <stop offset="45%" stopColor="#E8A020" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0.15" />
        </radialGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke={`url(#${gradId})`} filter={`url(#${filterId})`}>
        {Array.from({ length: 16 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 16
          return <path key={i} d={`M200,200 C${200 + Math.cos(rad - 0.32) * 115},${200 + Math.sin(rad - 0.32) * 115} ${200 + Math.cos(rad + 0.32) * 115},${200 + Math.sin(rad + 0.32) * 115} ${200 + Math.cos(rad) * 168},${200 + Math.sin(rad) * 168} Z`} strokeWidth="0.7" opacity="0.7" />
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 12
          return <path key={i} d={`M200,200 C${200 + Math.cos(rad - 0.42) * 72},${200 + Math.sin(rad - 0.42) * 72} ${200 + Math.cos(rad + 0.42) * 72},${200 + Math.sin(rad + 0.42) * 72} ${200 + Math.cos(rad) * 115},${200 + Math.sin(rad) * 115}`} strokeWidth="0.8" opacity="0.8" />
        })}
        {[22, 42, 60, 80, 100, 120, 143, 165, 178].map((r, i) => <circle key={i} cx="200" cy="200" r={r} strokeWidth={i % 3 === 0 ? 0.9 : 0.4} opacity={i % 3 === 0 ? 0.9 : 0.5} />)}
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 24
          return <line key={i} x1={200 + Math.cos(rad) * 22} y1={200 + Math.sin(rad) * 22} x2={200 + Math.cos(rad) * 178} y2={200 + Math.sin(rad) * 178} strokeWidth="0.4" opacity="0.45" />
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 8
          return <path key={i} d={`M200,200 C${200 + Math.cos(rad - 0.5) * 38},${200 + Math.sin(rad - 0.5) * 38} ${200 + Math.cos(rad + 0.5) * 38},${200 + Math.sin(rad + 0.5) * 38} ${200 + Math.cos(rad) * 57},${200 + Math.sin(rad) * 57}`} strokeWidth="1.1" stroke="#FBBF24" opacity="0.9" />
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 8
          return <line key={i} x1={200 + Math.cos(rad) * 52} y1={200 + Math.sin(rad) * 52} x2={200 + Math.cos(rad + Math.PI / 8) * 28} y2={200 + Math.sin(rad + Math.PI / 8) * 28} strokeWidth="0.9" stroke="#FBBF24" />
        })}
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 24
          return <circle key={i} cx={200 + Math.cos(rad) * 133} cy={200 + Math.sin(rad) * 133} r="2.8" fill="#FBBF24" stroke="none" opacity="0.8" />
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const rad = (i * 2 * Math.PI) / 16 + Math.PI / 16
          return <circle key={i} cx={200 + Math.cos(rad) * 155} cy={200 + Math.sin(rad) * 155} r="1.8" fill="#E8A020" stroke="none" opacity="0.6" />
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const rad = (i * 2 * Math.PI) / 8 + Math.PI / 8
          const x = 200 + Math.cos(rad) * 175
          const y = 200 + Math.sin(rad) * 175
          return <g key={i} transform={`translate(${x},${y}) rotate(${45 + i * 45})`}><rect x="-4" y="-4" width="8" height="8" rx="1" stroke="#FBBF24" strokeWidth="1" fill="#E8A020" fillOpacity="0.3" /></g>
        })}
        <circle cx="200" cy="200" r="16" strokeWidth="1.8" stroke="#FBBF24" opacity="0.9" />
        <circle cx="200" cy="200" r="9" strokeWidth="1" fill="#E8A020" fillOpacity="0.35" />
        <circle cx="200" cy="200" r="4" fill="#FBBF24" />
      </g>
    </svg>
  )
}

function getMotifBase64(color: string) {
  // Simple temple motif pattern SVG
  const svg = `<svg width="40" height="15" viewBox="0 0 40 15" xmlns="http://www.w3.org/2000/svg"><path d="M20 3 L23 8 L37 8 L40 13 L0 13 L3 8 L17 8 Z M20 7 L21 10 L19 10 Z" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.4"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
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

  const orangeMotif = getMotifBase64('#C0621A')
  const tealMotif = getMotifBase64('#1A9BAA')
  const purpleMotif = getMotifBase64('#6B2B9A') // Taj mahal is used instead for purple, but keeping for fallback
  const goldMotif = getMotifBase64('#B48C0A')

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex flex-col text-white"
      style={{
        backgroundColor: '#0A0A0A',
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%,   rgba(232,160,32,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 0%  100%, rgba(232,160,32,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(232,160,32,0.05) 0%, transparent 50%),
          radial-gradient(circle at center, #181818 1.5px, transparent 1.5px)
        `,
        backgroundSize: 'auto, auto, auto, 36px 36px',
      }}
    >
      {/* ── Universal Rotating Background Mandala ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="mandala-spin-slow absolute" style={{ top: '-38vmin', left: '-38vmin', width: '76vmin', height: '76vmin' }}>
          <MandalaCorner uid="dash-tl" opacity={0.5} />
        </div>
        <div className="mandala-spin-slow absolute" style={{ bottom: '-38vmin', right: '-38vmin', width: '76vmin', height: '76vmin' }}>
          <MandalaCorner uid="dash-br" opacity={0.5} />
        </div>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70vw', height: '50vh', background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '25vh', background: 'radial-gradient(ellipse, rgba(251,191,36,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* TOP NAV */}
        <nav className="flex items-start justify-between px-4 pt-4 w-full">
          <Link href="/" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ background: 'rgba(232,160,32,0.05)', border: '1.5px solid rgba(232,160,32,0.2)' }}>
            <ArrowLeft size={18} style={{ color: '#E8A020' }} />
          </Link>
          <Link href="/dashboard/events" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ background: 'rgba(232,160,32,0.05)', border: '1.5px solid rgba(232,160,32,0.2)' }}>
            <Menu size={18} style={{ color: '#E8A020' }} />
          </Link>
        </nav>

        {/* HEADER (Invisible in reference, but keeping minimal or removed? The reference image doesn't show "Welcome to NOVA UNPLUGGED '26". It just shows the cards. Let's keep it but minimal so cards can fit) */}
        
        {/* CARDS GRID */}
        <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 pb-12 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* CARD 01 · MY EVENTS */}
          <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'radial-gradient(circle at 35% 35%, #D97B3A, #8B3A0A)', boxShadow: '0 4px 15px rgba(192,98,26,0.6)' }}>
              01
            </div>
            <div className="flex-1 flex flex-col items-center rounded-2xl p-6 transition-all relative overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #1A0A06 0%, #100402 100%)', border: '1px solid #3D160A', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              
              <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: 'url("' + orangeMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

              <h2 className="font-black text-lg uppercase tracking-[0.25em] text-white text-center mb-2 mt-2">MY EVENTS</h2>
              <div className="rounded-full px-5 py-1 text-[10px] font-bold uppercase tracking-wider mb-8 text-white"
                style={{ background: '#A04510' }}>
                REGISTERED: {registrations ? registrations.length : 0} EVENTS
              </div>

              <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[200px]">
                {registrations && registrations.length > 0 ? (
                  <ul className="w-full space-y-3 z-10">
                    {registrations.map(reg => {
                      const ev = reg.events as any
                      return (
                        <li key={reg.id} className="rounded-xl p-3 flex items-start justify-between"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,98,26,0.2)' }}>
                          <div>
                            <p className="font-black text-xs uppercase text-white">{ev?.title}</p>
                            <p className="text-white/50 text-[10px] mt-0.5">{ev?.event_date || 'Date TBD'}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center mb-4">
                      <span className="absolute -left-8 text-[#C0621A] opacity-60 text-xs">✦</span>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ border: '1px dashed rgba(192,98,26,0.6)' }}>
                        <Calendar size={24} style={{ color: '#C0621A' }} strokeWidth={1.5} />
                      </div>
                      <span className="absolute -right-8 text-[#C0621A] opacity-60 text-xs">✦</span>
                    </div>
                    <p className="font-bold uppercase tracking-[0.15em] text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>NO EVENTS REGISTERED</p>
                  </div>
                )}
              </div>

              <Link href="/dashboard/events" className="w-full mt-6 z-10 block">
                <div className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold uppercase tracking-[0.1em] text-xs text-white transition-all hover:bg-white/5"
                  style={{ background: 'linear-gradient(90deg, #2A1006, #36150A)', border: '1px solid #5A2512' }}>
                  EXPLORE ALL EVENTS <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>

          {/* MIDDLE COLUMN: CARDS 02 + 03 */}
          <div className="flex flex-col gap-6 lg:gap-8">
            
            {/* CARD 02 · LIVE UPDATES */}
            <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'radial-gradient(circle at 35% 35%, #2AABB8, #0A5C6B)', boxShadow: '0 4px 15px rgba(26,107,122,0.6)' }}>
                02
              </div>
              <div className="flex flex-col rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #06161A 0%, #030C0E 100%)', border: '1px solid #0C343D', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                
                <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: 'url("' + tealMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-white text-center mb-1 mt-2">✦ LIVE UPDATES ✦</h2>
                <div className="flex justify-center gap-1.5 mb-5">
                  <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A9BAA]" />
                  <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                </div>
                
                <div className="space-y-2.5 z-10">
                  {announcements && announcements.length > 0 ? (
                    announcements.map(ann => (
                      <div key={ann.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                        style={{ background: 'rgba(26,107,122,0.1)', border: '1px solid rgba(26,107,122,0.2)' }}>
                        <Megaphone size={14} className="shrink-0" style={{ color: '#1A9BAA' }} />
                        <p className="text-white/80 text-[11px] leading-snug font-medium tracking-wide">{ann.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl"
                      style={{ background: 'rgba(26,107,122,0.1)', border: '1px solid rgba(26,107,122,0.2)' }}>
                      <Megaphone size={14} className="shrink-0" style={{ color: '#1A9BAA' }} />
                      <p className="text-white/80 text-[11px] leading-snug font-medium tracking-wide">Welcome to Nova Unplugged &apos;26!</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 mb-4 border-t border-dashed border-[#1A9BAA]/30 w-full" />
                <Link href="/dashboard/announcements" className="text-center z-10">
                  <span className="font-bold uppercase tracking-[0.1em] text-[10px] hover:text-white transition-colors" style={{ color: '#1A9BAA' }}>
                    VIEW ALL ANNOUNCEMENTS <ArrowRight size={10} className="inline ml-1 mb-0.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* CARD 03 · COUNTDOWN */}
            <div className="relative flex flex-col flex-1" style={{ paddingTop: '20px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'radial-gradient(circle at 35% 35%, #9B5BBF, #4A1580)', boxShadow: '0 4px 15px rgba(107,43,154,0.6)' }}>
                03
              </div>
              <div className="flex-1 flex flex-col rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #14071F 0%, #0A0310 100%)', border: '1px solid #321052', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                
                {/* Taj Mahal silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40">
                  <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="w-full h-full" fill="#6B2B9A">
                    <path d="M0,48 L0,30 L20,30 L20,22 L30,22 L30,14 L35,14 L35,6 L37,6 L37,3 L39,3 L39,6 L41,6 L41,14 L46,14 L46,22 L56,22 L56,30 L80,30 L80,24 L120,24 L120,16 L130,8 L136,0 L142,8 L152,16 L152,24 L190,24 L190,16 L200,8 L206,0 L212,8 L222,16 L222,24 L260,24 L260,16 L270,8 L276,0 L282,8 L292,16 L292,24 L330,24 L330,30 L355,30 L355,22 L364,22 L364,14 L369,14 L369,6 L371,6 L371,3 L373,3 L373,6 L375,6 L375,14 L380,14 L380,22 L390,22 L390,30 L400,30 L400,48 Z" />
                  </svg>
                </div>

                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-white text-center mb-1 mt-2">✦ COUNTDOWN ✦</h2>
                <div className="flex justify-center gap-1.5 mb-6">
                  <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B5BBF]" />
                  <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center z-10 pb-6">
                  <div className="rounded-2xl p-4 w-full max-w-[280px]" style={{ border: '1px dashed rgba(155,91,191,0.3)' }}>
                    <CountdownTimer targetDate={FEST_DATE} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 04 · DIGITAL GATE PASS */}
          <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'radial-gradient(circle at 35% 35%, #D4A820, #7A5C00)', boxShadow: '0 4px 15px rgba(180,140,10,0.6)' }}>
              04
            </div>
            <div className="flex-1 flex flex-col items-center rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #181504 0%, #0A0801 100%)', border: '1px solid #403606', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              
              <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: 'url("' + goldMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

              <h2 className="font-black text-sm uppercase tracking-[0.2em] text-white text-center mb-1 mt-2">✦ DIGITAL GATE PASS ✦</h2>
              <div className="flex justify-center gap-1.5 mb-6">
                <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B48C0A]" />
                <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
              </div>

              {isApproved && userData?.entry_code ? (
                <div className="w-full flex flex-col items-center flex-1 z-10">
                  <div className="bg-[#FAF8F5] p-3 rounded-2xl mb-4 shadow-lg w-48 h-48 flex items-center justify-center">
                    <QRDisplay
                      value={userData.entry_code}
                      size={168}
                      downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                      hideDownload={true}
                    />
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mb-5 font-bold uppercase tracking-[0.1em] text-xs text-[#B48C0A] transition-all hover:bg-white/5"
                    style={{ background: 'linear-gradient(90deg, #1A1604, #262006)', border: '1px solid #4D3F08' }}>
                    <Download size={14} /> DOWNLOAD QR
                  </button>

                  <div className="w-full rounded-xl p-4 mt-auto"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="font-black text-[13px] uppercase text-white leading-tight tracking-wide">{userData?.full_name}</p>
                    <p className="text-white/40 text-[10px] mt-0.5 mb-3 truncate">{userData?.email}</p>
                    <div className="flex gap-2">
                      <span className="flex-1 text-center text-[9px] font-bold uppercase py-1.5 rounded-lg"
                        style={{ background: 'rgba(180,140,10,0.1)', color: '#B48C0A', border: '1px solid rgba(180,140,10,0.2)' }}>
                        {userData?.batch || 'Batch TBD'}
                      </span>
                      <span className="flex-1 text-center text-[9px] font-bold uppercase py-1.5 rounded-lg"
                        style={{ background: 'rgba(180,140,10,0.1)', color: '#B48C0A', border: '1px solid rgba(180,140,10,0.2)' }}>
                        {userData?.zone || 'Zone TBD'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center flex-1 w-full z-10">
                  <div className="w-full flex-1 rounded-xl flex flex-col items-center justify-center py-8 mb-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(180,140,10,0.3)' }}>
                    <Lock size={32} style={{ color: '#B48C0A' }} className="mb-3 opacity-80" />
                    <p className="font-black text-sm uppercase tracking-wider text-white/80 mb-1">PASS LOCKED</p>
                    <p className="text-white/40 text-[10px] text-center max-w-[140px] leading-relaxed">
                      Complete payment to unlock your digital pass
                    </p>
                  </div>
                  <Link href="/payment" className="w-full">
                    <div className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold uppercase tracking-[0.1em] text-xs text-[#B48C0A] transition-all hover:bg-white/5"
                      style={{ background: 'linear-gradient(90deg, #1A1604, #262006)', border: '1px solid #4D3F08' }}>
                      GO TO PAYMENT <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
