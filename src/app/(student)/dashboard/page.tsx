import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatIST } from '@/lib/utils/dateUtils'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { ArrowLeft, Menu, ArrowRight, Megaphone, Lock, Calendar, ChevronRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

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
      className="min-h-screen w-full relative overflow-hidden flex flex-col text-white"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #2a1000 0%, #140800 40%, #0a0400 70%, #050200 100%)' }}
    >
      {/* ── Starfield dots ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(232,160,32,0.35) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
      }} />

      {/* ── Bottom city silhouette ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '80px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full" fill="#E8A020" fillOpacity="0.12">
          <path d="
            M0,80 L0,55 L30,55 L30,40 L38,40 L38,25 L42,25 L42,12 L44,12 L44,8 L46,8 L46,12 L48,12 L48,25
            L52,25 L52,40 L60,40 L60,55 L100,55 L100,45 L140,45 L140,30 L148,15 L152,5 L156,15 L164,30 L164,45
            L200,45 L200,55 L260,55 L260,42 L300,42 L300,28 L308,14 L312,4 L316,14 L324,28 L324,42 L360,42
            L360,55 L420,55 L420,44 L460,44 L460,30 L468,18 L472,8 L476,18 L484,30 L484,44
            L520,44 L520,55 L580,55 L580,45 L640,45 L640,30 L648,15 L652,5 L656,15 L664,30 L664,45
            L700,45 L700,55 L740,55 L740,44 L780,44 L780,30 L788,16 L792,6 L796,16 L804,30 L804,44
            L840,44 L840,55 L900,55 L900,42 L940,42 L940,28 L948,14 L952,4 L956,14 L964,28 L964,42
            L1000,42 L1000,55 L1060,55 L1060,44 L1100,44 L1100,28 L1108,14 L1112,4 L1116,14 L1124,28 L1124,44
            L1160,44 L1160,55 L1220,55 L1220,40 L1228,40 L1228,25 L1232,25 L1232,10 L1234,10 L1234,6 L1236,6
            L1236,10 L1238,10 L1238,25 L1242,25 L1242,40 L1250,40 L1250,55 L1300,55 L1300,45 L1340,45
            L1340,55 L1440,55 L1440,80 Z
          " />
        </svg>
      </div>

      {/* ── Mandala top-left ───────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 pointer-events-none w-40 md:w-56 lg:w-64 opacity-40">
        <svg viewBox="0 0 220 220" fill="none">
          {/* Outer ring of elongated petals */}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(d => (
            <ellipse key={d} cx="110" cy="110" rx="95" ry="14" fill="none" stroke="#E8A020" strokeWidth="0.7"
              transform={`rotate(${d} 110 110)`} />
          ))}
          {/* Mid petals filled */}
          {[0,45,90,135,180,225,270,315].map(d => (
            <ellipse key={d} cx="110" cy="110" rx="65" ry="10" fill="#E8A020" fillOpacity="0.1"
              stroke="#E8A020" strokeWidth="0.5" transform={`rotate(${d} 110 110)`} />
          ))}
          <circle cx="110" cy="110" r="50" fill="none" stroke="#E8A020" strokeWidth="0.6" strokeDasharray="3 5" />
          <circle cx="110" cy="110" r="32" fill="none" stroke="#E8A020" strokeWidth="0.9" />
          <circle cx="110" cy="110" r="16" fill="none" stroke="#E8A020" strokeWidth="0.6" />
          <circle cx="110" cy="110" r="6" fill="#E8A020" fillOpacity="0.5" />
          {/* Petal tip dots */}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((d, i) => {
            const rad = (d * Math.PI) / 180
            return <circle key={i} cx={110 + 95 * Math.cos(rad)} cy={110 + 95 * Math.sin(rad)} r="2" fill="#E8A020" fillOpacity="0.6" />
          })}
        </svg>
      </div>

      {/* ── Mandala top-right (mirror) ────────────────────────────────────── */}
      <div className="absolute top-0 right-0 pointer-events-none w-40 md:w-56 lg:w-64 opacity-40" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 220 220" fill="none">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(d => (
            <ellipse key={d} cx="110" cy="110" rx="95" ry="14" fill="none" stroke="#E8A020" strokeWidth="0.7"
              transform={`rotate(${d} 110 110)`} />
          ))}
          {[0,45,90,135,180,225,270,315].map(d => (
            <ellipse key={d} cx="110" cy="110" rx="65" ry="10" fill="#E8A020" fillOpacity="0.1"
              stroke="#E8A020" strokeWidth="0.5" transform={`rotate(${d} 110 110)`} />
          ))}
          <circle cx="110" cy="110" r="50" fill="none" stroke="#E8A020" strokeWidth="0.6" strokeDasharray="3 5" />
          <circle cx="110" cy="110" r="32" fill="none" stroke="#E8A020" strokeWidth="0.9" />
          <circle cx="110" cy="110" r="16" fill="none" stroke="#E8A020" strokeWidth="0.6" />
          <circle cx="110" cy="110" r="6" fill="#E8A020" fillOpacity="0.5" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((d, i) => {
            const rad = (d * Math.PI) / 180
            return <circle key={i} cx={110 + 95 * Math.cos(rad)} cy={110 + 95 * Math.sin(rad)} r="2" fill="#E8A020" fillOpacity="0.6" />
          })}
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP NAV BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <nav className="relative z-20 flex items-start justify-between px-4 pt-4 w-full">
        <Link href="/" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ background: 'rgba(232,160,32,0.12)', border: '1.5px solid rgba(232,160,32,0.35)' }}>
          <ArrowLeft size={18} style={{ color: '#E8A020' }} />
        </Link>
        <Link href="/dashboard/events" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ background: 'rgba(232,160,32,0.12)', border: '1.5px solid rgba(232,160,32,0.35)' }}>
          <Menu size={18} style={{ color: '#E8A020' }} />
        </Link>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="relative z-10 w-full text-center px-4 pt-1 pb-4">
        {/* Floating star dots */}
        <span className="absolute left-1/4 top-2 w-1.5 h-1.5 rounded-full bg-[#E8A020] opacity-60 animate-pulse" />
        <span className="absolute right-1/4 top-4 w-1 h-1 rounded-full bg-[#E8A020] opacity-40 animate-pulse" style={{ animationDelay: '0.7s' }} />
        <span className="absolute left-1/3 top-6 w-1 h-1 rounded-full bg-[#E8A020] opacity-50 animate-pulse" style={{ animationDelay: '1.4s' }} />

        {/* "Welcome to" italic */}
        <p style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          color: '#E8A020',
          letterSpacing: '0.04em',
          marginBottom: '2px',
        }}>
          Welcome to
        </p>

        {/* NOVA UNPLUGGED '26 */}
        <h1 className="flex flex-wrap items-baseline justify-center leading-none" style={{ gap: '0.4em' }}>
          <span style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 7.5vw, 6rem)',
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            NOVA
          </span>
          <span style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 6vw, 4.8rem)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FBBF24 0%, #E8A020 50%, #C8800A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            UNPLUGGED &apos;26
          </span>
        </h1>

        {/* Decorative separator line + stars */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-20 md:w-32" style={{ background: 'linear-gradient(to right, transparent, #E8A020aa)' }} />
          <span style={{ color: '#E8A020', fontSize: '10px', letterSpacing: '6px' }}>✦ ✦ ✦</span>
          <div className="h-px w-20 md:w-32" style={{ background: 'linear-gradient(to left, transparent, #E8A020aa)' }} />
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CARDS GRID  (3 columns)
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-[1300px] mx-auto px-4 pb-6 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD 01 · MY EVENTS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
          {/* Number bubble */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'radial-gradient(circle at 35% 35%, #D97B3A, #8B3A0A)', boxShadow: '0 4px 15px rgba(192,98,26,0.6)', border: '2px solid #C0621A88' }}>
            01
          </div>
          <Link href="/dashboard/events"
            className="flex-1 flex flex-col items-center rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'linear-gradient(170deg, #3D1208 0%, #200A03 60%, #150602 100%)', border: '1.5px solid #8B3A1A66', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 40px rgba(139,58,10,0.25)' }}
          >
            <h2 className="font-black text-lg uppercase tracking-[0.25em] text-white text-center mb-2" style={{ fontFamily: '"Big Shoulders Display", sans-serif' }}>
              My Events
            </h2>

            {/* Registered badge */}
            <div className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-6 text-white"
              style={{ background: '#C0621A', boxShadow: '0 2px 10px rgba(192,98,26,0.5)' }}>
              Registered: {registrations ? registrations.length : 0} Events
            </div>

            {/* Events or empty state */}
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              {registrations && registrations.length > 0 ? (
                <ul className="w-full space-y-3">
                  {registrations.map(reg => {
                    const ev = reg.events as any
                    return (
                      <li key={reg.id} className="rounded-xl p-3 flex items-start justify-between"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,98,26,0.2)' }}>
                        <div>
                          <p className="font-black text-xs uppercase text-white">{ev?.title}</p>
                          <p className="text-white/50 text-[10px] mt-0.5">{ev?.event_date || 'Date TBD'}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                          style={{ background: 'rgba(192,98,26,0.15)', color: '#C0621A', border: '1px solid rgba(192,98,26,0.35)' }}>
                          {ev?.categories?.title || 'Event'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center py-8">
                  {/* Calendar icon with sparkle decorators */}
                  <div className="relative flex items-center justify-center mb-5">
                    {/* left sparkle */}
                    <span className="absolute -left-7 text-[#C0621A] opacity-60" style={{ fontSize: '18px' }}>✦</span>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ border: '1.5px solid rgba(192,98,26,0.5)', background: 'radial-gradient(circle, rgba(192,98,26,0.15) 0%, transparent 70%)' }}>
                      <Calendar size={28} style={{ color: '#C0621A' }} />
                    </div>
                    {/* right sparkle */}
                    <span className="absolute -right-7 text-[#C0621A] opacity-60" style={{ fontSize: '18px' }}>✦</span>
                  </div>
                  <p className="font-bold uppercase tracking-[0.2em] text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    No Events Registered
                  </p>
                </div>
              )}
            </div>

            {/* Explore button */}
            <div className="w-full mt-6">
              <div className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-black uppercase tracking-[0.15em] text-xs text-white transition-all group-hover:gap-4"
                style={{ background: 'linear-gradient(90deg, #C0621A, #E8840A)', boxShadow: '0 4px 20px rgba(192,98,26,0.45)' }}>
                Explore All Events <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MIDDLE COLUMN: CARD 02 + CARD 03 stacked
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex flex-col gap-5">

          {/* CARD 02 · LIVE UPDATES */}
          <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'radial-gradient(circle at 35% 35%, #2AABB8, #0A5C6B)', boxShadow: '0 4px 15px rgba(26,107,122,0.7)', border: '2px solid #1A7A8888' }}>
              02
            </div>
            <Link href="/dashboard/announcements"
              className="flex flex-col rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(170deg, #052D36 0%, #021A22 60%, #010D12 100%)', border: '1.5px solid rgba(26,107,122,0.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 40px rgba(10,90,107,0.25)' }}
            >
              {/* Title with diamonds */}
              <h2 className="font-black text-base uppercase tracking-[0.22em] text-white text-center mb-1" style={{ fontFamily: '"Big Shoulders Display", sans-serif' }}>
                ✦ Live Updates ✦
              </h2>
              {/* Dot separator */}
              <div className="flex justify-center gap-1.5 mb-4">
                <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A9BAA]" />
                <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
              </div>

              <div className="space-y-2.5">
                {announcements && announcements.length > 0 ? (
                  announcements.map(ann => (
                    <div key={ann.id} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(26,107,122,0.15)', border: '1px solid rgba(26,107,122,0.3)' }}>
                      <Megaphone size={15} className="shrink-0 mt-0.5" style={{ color: '#1A9BAA' }} />
                      <p className="text-white/75 text-xs leading-snug">{ann.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(26,107,122,0.15)', border: '1px solid rgba(26,107,122,0.3)' }}>
                    <Megaphone size={15} className="shrink-0 mt-0.5" style={{ color: '#1A9BAA' }} />
                    <p className="text-white/65 text-xs leading-snug">Welcome to Nova Unplugged &apos;26!</p>
                  </div>
                )}
              </div>

              {/* Teal border decoration */}
              <div className="mt-4 mb-2 h-px w-full" style={{ background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(26,155,170,0.4) 4px, rgba(26,155,170,0.4) 8px)' }} />

              <div className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] transition-all group-hover:gap-2" style={{ color: '#1A9BAA' }}>
                View All Announcements <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* CARD 03 · COUNTDOWN */}
          <div className="relative flex flex-col flex-1" style={{ paddingTop: '20px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'radial-gradient(circle at 35% 35%, #9B5BBF, #4A1580)', boxShadow: '0 4px 15px rgba(107,43,154,0.7)', border: '2px solid #6B2B9A88' }}>
              03
            </div>
            <div className="flex-1 flex flex-col rounded-2xl p-6 overflow-hidden"
              style={{ background: 'linear-gradient(170deg, #1C0730 0%, #110420 60%, #080214 100%)', border: '1.5px solid rgba(107,43,154,0.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 40px rgba(74,21,128,0.3)' }}>

              <h2 className="font-black text-base uppercase tracking-[0.22em] text-white text-center mb-1" style={{ fontFamily: '"Big Shoulders Display", sans-serif' }}>
                ✦ Countdown ✦
              </h2>
              <div className="flex justify-center gap-1.5 mb-5">
                <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B5BBF]" />
                <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <CountdownTimer targetDate={FEST_DATE} />
              </div>

              {/* Taj Mahal silhouette at bottom */}
              <div className="mt-3 -mx-6 -mb-6 h-12 overflow-hidden">
                <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="w-full h-full" fill="#6B2B9A" fillOpacity="0.35">
                  <path d="M0,48 L0,30 L20,30 L20,22 L30,22 L30,14 L35,14 L35,6 L37,6 L37,3 L39,3 L39,6 L41,6 L41,14 L46,14 L46,22 L56,22 L56,30 L80,30 L80,24 L120,24 L120,16 L130,8 L136,0 L142,8 L152,16 L152,24 L190,24 L190,16 L200,8 L206,0 L212,8 L222,16 L222,24 L260,24 L260,16 L270,8 L276,0 L282,8 L292,16 L292,24 L330,24 L330,30 L355,30 L355,22 L364,22 L364,14 L369,14 L369,6 L371,6 L371,3 L373,3 L373,6 L375,6 L375,14 L380,14 L380,22 L390,22 L390,30 L400,30 L400,48 Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD 04 · DIGITAL GATE PASS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="relative flex flex-col" style={{ paddingTop: '20px' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'radial-gradient(circle at 35% 35%, #D4A820, #7A5C00)', boxShadow: '0 4px 15px rgba(180,140,10,0.65)', border: '2px solid #A88A1088' }}>
            04
          </div>
          <div className="flex-1 flex flex-col items-center rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'linear-gradient(170deg, #28200A 0%, #181200 60%, #0C0A02 100%)', border: '1.5px solid rgba(200,160,20,0.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 40px rgba(140,122,10,0.25)' }}>

            <h2 className="font-black text-base uppercase tracking-[0.18em] text-white text-center mb-1" style={{ fontFamily: '"Big Shoulders Display", sans-serif' }}>
              ✦ Digital Gate Pass ✦
            </h2>
            <div className="flex justify-center gap-1.5 mb-4">
              <span className="w-1 h-1 rounded-full bg-[#E8A020] opacity-60" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020]" />
              <span className="w-1 h-1 rounded-full bg-[#E8A020] opacity-60" />
            </div>

            {isApproved && userData?.entry_code ? (
              <Link href="/profile" className="w-full flex flex-col items-center flex-1">
                <div className="w-full flex justify-center mb-4">
                  <QRDisplay
                    value={userData.entry_code}
                    size={180}
                    downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                  />
                </div>
                <div className="w-full rounded-xl p-4 mt-auto"
                  style={{ background: 'rgba(232,160,32,0.06)', border: '1px solid rgba(232,160,32,0.2)' }}>
                  <p className="font-black text-sm uppercase text-white leading-tight tracking-wide">{userData?.full_name}</p>
                  <p className="text-white/45 text-xs mt-0.5 mb-3 truncate">{userData?.email}</p>
                  <div className="flex gap-2">
                    <span className="flex-1 text-center text-[10px] font-black uppercase py-1 rounded-lg"
                      style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)' }}>
                      {userData?.batch || 'Batch TBD'}
                    </span>
                    <div className="w-px" style={{ background: 'rgba(232,160,32,0.2)' }} />
                    <span className="flex-1 text-center text-[10px] font-black uppercase py-1 rounded-lg"
                      style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)' }}>
                      {userData?.zone || 'Zone TBD'}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center flex-1 w-full">
                <div className="w-full flex-1 rounded-xl flex flex-col items-center justify-center py-8 mb-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,160,32,0.15)' }}>
                  <Lock size={36} style={{ color: '#E8A020' }} className="mb-3 animate-pulse" />
                  <p className="font-black text-base uppercase tracking-wider text-white/90 mb-1">Pass Locked</p>
                  <p className="text-white/45 text-xs text-center max-w-[160px] leading-relaxed">
                    Complete payment to unlock your digital gate pass
                  </p>
                </div>
                <Link href="/payment"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-black uppercase tracking-[0.15em] text-xs text-white transition-all"
                  style={{ background: 'linear-gradient(90deg, #8C7A0A, #E8A020)', boxShadow: '0 4px 20px rgba(232,160,32,0.3)' }}>
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
