import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { ArrowRight, Megaphone, Calendar, Download, Lock } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

/** Universal background layer matching the exact reference grid & dots */
function BackgroundLayer() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#0B0B0B', overflow: 'hidden' }}>
      {/* Dimmed dot grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(232,160,32,0.15) 1px, transparent 1.5px)',
        backgroundSize: '40px 40px'
      }} />
      {/* Corner rotating mandalas (faint) */}
      <div className="absolute -top-[40vmin] -left-[40vmin] w-[80vmin] h-[80vmin] animate-[spin_60s_linear_infinite] opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#E8A020" strokeWidth="0.2">
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M50,50 L${50+45*Math.cos(i*Math.PI/6)},${50+45*Math.sin(i*Math.PI/6)}`} />
          ))}
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="35" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>
      <div className="absolute -bottom-[40vmin] -right-[40vmin] w-[80vmin] h-[80vmin] animate-[spin_60s_linear_infinite] opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#E8A020" strokeWidth="0.2">
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M50,50 L${50+45*Math.cos(i*Math.PI/6)},${50+45*Math.sin(i*Math.PI/6)}`} />
          ))}
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="35" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>
    </div>
  )
}

function getMotifBase64(color: string) {
  const svg = `<svg width="80" height="12" viewBox="0 0 80 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,12 L80,12 M20,12 L25,4 L30,12 M25,4 L25,0 M22,2 L28,2 M60,12 L65,7 L70,12 M65,7 L65,3" fill="none" stroke="${color}" strokeWidth="1" opacity="0.3"/>
  </svg>`
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
  const goldMotif = getMotifBase64('#B48C0A')

  return (
    <div className="min-h-screen w-full relative flex flex-col text-white" style={{ backgroundColor: '#0B0B0B' }}>
      <BackgroundLayer />

      <main className="relative z-10 flex-1 w-full max-w-[1300px] mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* CARD 01 · MY EVENTS */}
        <div className="relative flex flex-col h-full pt-[20px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #D97B3A, #8B3A0A)', boxShadow: '0 0 15px rgba(217,123,58,0.5)' }}>
            01
          </div>
          
          <div className="flex-1 flex flex-col items-center rounded-3xl p-8 relative overflow-hidden z-10"
            style={{ background: 'linear-gradient(180deg, #1C0A04 0%, #0D0402 100%)', border: '1.5px solid #4A1B0C', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[150px] pointer-events-none opacity-40 z-0"
              style={{ background: 'radial-gradient(ellipse at top, #D97B3A 0%, transparent 70%)', filter: 'blur(20px)' }} />

            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{ backgroundImage: 'url("' + orangeMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

            <div className="relative z-10 flex flex-col items-center w-full h-full">
              <h2 className="font-black text-[22px] uppercase tracking-[0.25em] text-[#FDE6D5] text-center mt-6 mb-3 font-sans">MY EVENTS</h2>
              <div className="rounded-full px-6 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FDE6D5] mb-8"
                style={{ background: '#9A3A12' }}>
                REGISTERED: {registrations ? registrations.length : 0} EVENTS
              </div>

              <div className="w-full flex-1 flex flex-col items-center justify-center py-10 min-h-[250px]">
                {registrations && registrations.length > 0 ? (
                  <ul className="w-full space-y-4">
                    {registrations.map(reg => {
                      const ev = reg.events as any
                      return (
                        <li key={reg.id} className="rounded-xl p-4 flex items-start justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(192,98,26,0.15)' }}>
                          <div><p className="font-black text-sm uppercase text-[#FDE6D5]">{ev?.title}</p></div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-80">
                    <div className="flex items-center justify-center gap-6 mb-6">
                      <span className="text-[#9A3A12] text-[10px]">✦</span>
                      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#9A3A12] opacity-70"></div>
                        <Calendar size={26} color="#9A3A12" strokeWidth={1.5} />
                      </div>
                      <span className="text-[#9A3A12] text-[10px]">✦</span>
                    </div>
                    <p className="font-bold uppercase tracking-[0.15em] text-[11px] text-[#8B3A0A]">NO EVENTS REGISTERED</p>
                  </div>
                )}
              </div>

              <Link href="/dashboard/events" className="w-full mt-auto mb-2 block">
                <div className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold uppercase tracking-[0.15em] text-xs text-[#FDE6D5] transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(90deg, #381308, #2A0E06)', border: '1px solid #5A2512', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                  EXPLORE ALL EVENTS <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: CARDS 02 + 03 */}
        <div className="flex flex-col gap-10">
          
          {/* CARD 02 · LIVE UPDATES */}
          <div className="relative flex flex-col pt-[20px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #2AABB8, #0A5C6B)', boxShadow: '0 0 15px rgba(42,171,184,0.5)' }}>
              02
            </div>
            
            <div className="flex flex-col rounded-3xl px-6 pt-10 pb-6 relative overflow-hidden z-10"
              style={{ background: 'linear-gradient(180deg, #04171A 0%, #020B0D 100%)', border: '1.5px solid #0C4A54', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[150px] pointer-events-none opacity-40 z-0"
                style={{ background: 'radial-gradient(ellipse at top, #2AABB8 0%, transparent 70%)', filter: 'blur(20px)' }} />

              <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{ backgroundImage: 'url("' + tealMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

              <div className="relative z-10 flex flex-col items-center w-full">
                <h2 className="font-bold text-base uppercase tracking-[0.25em] text-[#E0F7FA] text-center mb-1 font-sans">✦ LIVE UPDATES ✦</h2>
                <div className="flex justify-center gap-1.5 mb-6">
                  <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                  <span className="w-[5px] h-[5px] rounded-full bg-[#1A9BAA]" />
                  <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                </div>
                
                <div className="w-full rounded-xl overflow-hidden mb-6" style={{ background: 'rgba(26,107,122,0.06)', border: '1px solid rgba(26,107,122,0.3)' }}>
                  {announcements && announcements.length > 0 ? (
                    <div className="flex items-center gap-3 p-4">
                      <Megaphone size={16} color="#1A9BAA" />
                      <p className="text-[#E0F7FA] text-xs font-medium tracking-wide">{announcements[0].title}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4">
                      <Megaphone size={16} color="#1A9BAA" />
                      <p className="text-[#E0F7FA] text-xs font-medium tracking-wide">Welcome to Nova Unplugged 2026</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed border-[#1A9BAA]/30 w-[120%] -ml-[10%] mb-4" />
                
                <Link href="/dashboard/announcements" className="text-center w-full py-1">
                  <span className="font-bold uppercase tracking-[0.1em] text-[10px] text-[#1A9BAA] hover:brightness-125 transition-colors">
                    VIEW ALL ANNOUNCEMENTS <ArrowRight size={10} className="inline ml-1 mb-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 03 · COUNTDOWN */}
          <div className="relative flex flex-col flex-1 pt-[20px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #9B5BBF, #4A1580)', boxShadow: '0 0 15px rgba(155,91,191,0.5)' }}>
              03
            </div>
            
            <div className="flex-1 flex flex-col rounded-3xl p-8 relative overflow-hidden z-10"
              style={{ background: 'linear-gradient(180deg, #160424 0%, #0B0212 100%)', border: '1.5px solid #3A1059', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[150px] pointer-events-none opacity-40 z-0"
                style={{ background: 'radial-gradient(ellipse at top, #9B5BBF 0%, transparent 70%)', filter: 'blur(20px)' }} />

              <div className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none opacity-70" style={{
                backgroundImage: 'url("data:image/svg+xml;base64,' + Buffer.from(`<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,80 L400,80 L400,60 L380,60 L370,40 L360,60 L320,60 L310,25 L300,60 L250,60 L230,15 L220,0 L210,15 L190,60 L140,60 L130,25 L120,60 L80,60 L70,40 L60,60 L0,60 Z" fill="#3A1059"/></svg>`).toString('base64') + '")',
                backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom'
              }} />

              <div className="relative z-10 flex flex-col items-center w-full h-full">
                <h2 className="font-bold text-base uppercase tracking-[0.25em] text-[#F3E8FF] text-center mt-2 mb-1 font-sans">✦ COUNTDOWN ✦</h2>
                <div className="flex justify-center gap-1.5 mb-8">
                  <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                  <span className="w-[5px] h-[5px] rounded-full bg-[#9B5BBF]" />
                  <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full pb-8">
                  <div className="rounded-[28px] px-8 py-8 w-full relative flex justify-center border-t-0 border-b-0 border-l border-r border-[#3A1059] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[#3A1059] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-[#3A1059]">
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#9B5BBF] transform rotate-45" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#9B5BBF] transform rotate-45" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#9B5BBF] transform rotate-45" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#9B5BBF] transform rotate-45" />
                    
                    <CountdownTimer targetDate={FEST_DATE} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 04 · DIGITAL GATE PASS */}
        <div className="relative flex flex-col h-full pt-[20px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #D4A820, #7A5C00)', boxShadow: '0 0 15px rgba(212,168,32,0.5)' }}>
            04
          </div>
          
          <div className="flex-1 flex flex-col items-center rounded-3xl p-8 relative overflow-hidden z-10"
            style={{ background: 'linear-gradient(180deg, #1F1704 0%, #0E0A02 100%)', border: '1.5px solid #59450C', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[150px] pointer-events-none opacity-40 z-0"
              style={{ background: 'radial-gradient(ellipse at top, #D4A820 0%, transparent 70%)', filter: 'blur(20px)' }} />

            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{ backgroundImage: 'url("' + goldMotif + '")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

            <div className="relative z-10 flex flex-col items-center w-full h-full">
              <h2 className="font-bold text-[15px] uppercase tracking-[0.25em] text-[#FEF3C7] text-center mt-3 mb-1 font-sans">✦ DIGITAL GATE PASS ✦</h2>
              <div className="flex justify-center gap-1.5 mb-10">
                <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
                <span className="w-[5px] h-[5px] rounded-full bg-[#B48C0A]" />
                <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
              </div>

              {isApproved && userData?.entry_code ? (
                <div className="w-full flex flex-col items-center flex-1">
                  <div className="bg-white p-5 rounded-3xl mb-4 w-[280px] h-[280px] flex items-center justify-center shadow-xl">
                    <QRDisplay value={userData.entry_code} size={240} downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`} />
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-4 mb-auto font-bold uppercase tracking-[0.1em] text-[11px] text-[#B48C0A] hover:bg-white/5 transition-all"
                    style={{ background: '#291A05', border: '1px solid #59450C' }}>
                    <Download size={14} /> DOWNLOAD QR
                  </button>

                  <div className="w-full rounded-2xl p-6 mt-8 mb-2 text-left" style={{ background: '#1A1102', border: '1px solid #4D3308' }}>
                    <p className="font-black text-[15px] uppercase text-white mb-1">{userData?.full_name}</p>
                    <p className="text-[#8B7C62] text-[11px] mb-5 truncate">{userData?.email}</p>
                    <div className="flex gap-4">
                      <span className="flex-1 text-center text-[10px] font-bold uppercase py-2.5 rounded-lg" style={{ background: '#1A1102', color: '#B48C0A', border: '1px solid #4D3308' }}>
                        {userData?.batch || 'Batch TBD'}
                      </span>
                      <span className="flex-1 text-center text-[10px] font-bold uppercase py-2.5 rounded-lg" style={{ background: '#1A1102', color: '#B48C0A', border: '1px solid #4D3308' }}>
                        {userData?.zone || 'Zone TBD'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 w-full opacity-80 py-20">
                  <div className="mb-6">
                    <Lock size={36} color="#B48C0A" />
                  </div>
                  <p className="font-bold text-[12px] uppercase tracking-[0.2em] text-[#B48C0A] mb-8">PASS LOCKED</p>
                  <Link href="/payment" className="w-full mt-auto">
                    <div className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold uppercase tracking-[0.1em] text-[11px] text-[#B48C0A] hover:bg-white/5 transition-all"
                      style={{ background: '#291A05', border: '1px solid #59450C' }}>
                      GO TO PAYMENT <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
