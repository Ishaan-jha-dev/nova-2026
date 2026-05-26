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
        <div className="relative flex flex-col h-full mt-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none opacity-40 z-0"
            style={{ background: 'radial-gradient(circle, #D97B3A 0%, transparent 70%)', filter: 'blur(15px)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #D97B3A, #8B3A0A)', boxShadow: '0 0 15px rgba(217,123,58,0.5)' }}>
            01
          </div>
          
          <div className="flex-1 flex flex-col items-center rounded-[20px] p-6 lg:p-10 relative overflow-hidden z-10"
            style={{ background: 'linear-gradient(180deg, #1C0A04 0%, #0D0402 100%)', border: '1px solid #4A1B0C', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: `url("${orangeMotif}")`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

            <h2 className="font-bold text-xl uppercase tracking-[0.3em] text-[#FDE6D5] text-center mt-2 mb-3 font-sans">MY EVENTS</h2>
            <div className="rounded-full px-5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#FDE6D5] mb-auto"
              style={{ background: '#9A3A12' }}>
              REGISTERED: {registrations ? registrations.length : 0} EVENTS
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {registrations && registrations.length > 0 ? (
                <ul className="w-full space-y-3 z-10">
                  {registrations.map(reg => {
                    const ev = reg.events as any
                    return (
                      <li key={reg.id} className="rounded-xl p-3 flex items-start justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(192,98,26,0.15)' }}>
                        <div><p className="font-black text-xs uppercase text-[#FDE6D5]">{ev?.title}</p></div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center opacity-80">
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <span className="text-[#9A3A12] text-xs">✦</span>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ border: '1px dashed #9A3A12' }}>
                      <Calendar size={28} color="#9A3A12" strokeWidth={1.5} />
                    </div>
                    <span className="text-[#9A3A12] text-xs">✦</span>
                  </div>
                  <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-[#8B3A0A]">NO EVENTS REGISTERED</p>
                </div>
              )}
            </div>

            <Link href="/dashboard/events" className="w-full mt-auto pt-8 z-10">
              <div className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold uppercase tracking-[0.1em] text-xs text-[#FDE6D5] transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(90deg, #381308, #2A0E06)', border: '1px solid #5A2512', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                EXPLORE ALL EVENTS <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        {/* MIDDLE COLUMN: CARDS 02 + 03 */}
        <div className="flex flex-col gap-10 mt-4">
          
          {/* CARD 02 · LIVE UPDATES */}
          <div className="relative flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none opacity-40 z-0"
              style={{ background: 'radial-gradient(circle, #2AABB8 0%, transparent 70%)', filter: 'blur(15px)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #2AABB8, #0A5C6B)', boxShadow: '0 0 15px rgba(42,171,184,0.5)' }}>
              02
            </div>
            
            <div className="flex flex-col rounded-[20px] p-6 relative overflow-hidden z-10"
              style={{ background: 'linear-gradient(180deg, #04171A 0%, #020B0D 100%)', border: '1px solid #0C4A54', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
              <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: `url("${tealMotif}")`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

              <h2 className="font-bold text-sm uppercase tracking-[0.25em] text-[#E0F7FA] text-center mt-2 mb-1 font-sans">✦ LIVE UPDATES ✦</h2>
              <div className="flex justify-center gap-1.5 mb-6">
                <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A9BAA]" />
                <span className="w-1 h-1 rounded-full bg-[#1A9BAA] opacity-60" />
              </div>
              
              <div className="space-y-3 z-10 mb-6">
                {announcements && announcements.length > 0 ? (
                  announcements.map(ann => (
                    <div key={ann.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(26,107,122,0.08)', border: '1px solid rgba(26,107,122,0.3)' }}>
                      <Megaphone size={14} color="#1A9BAA" />
                      <p className="text-[#E0F7FA] text-[11px] font-medium tracking-wide">{ann.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(26,107,122,0.08)', border: '1px solid rgba(26,107,122,0.3)' }}>
                    <Megaphone size={14} color="#1A9BAA" />
                    <p className="text-[#E0F7FA] text-[11px] font-medium tracking-wide">Welcome to Nova Unplugged 2026</p>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-[#1A9BAA]/30 w-full absolute bottom-12 left-0" />
              <Link href="/dashboard/announcements" className="text-center z-10 mt-2">
                <span className="font-bold uppercase tracking-[0.1em] text-[9px] text-[#1A9BAA] hover:brightness-125 transition-colors">
                  VIEW ALL ANNOUNCEMENTS <ArrowRight size={10} className="inline ml-1 mb-0.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* CARD 03 · COUNTDOWN */}
          <div className="relative flex flex-col flex-1 mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none opacity-40 z-0"
              style={{ background: 'radial-gradient(circle, #9B5BBF 0%, transparent 70%)', filter: 'blur(15px)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #9B5BBF, #4A1580)', boxShadow: '0 0 15px rgba(155,91,191,0.5)' }}>
              03
            </div>
            
            <div className="flex-1 flex flex-col rounded-[20px] p-6 lg:p-8 relative overflow-hidden z-10"
              style={{ background: 'linear-gradient(180deg, #160424 0%, #0B0212 100%)', border: '1px solid #3A1059', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none opacity-50" style={{
                backgroundImage: 'url("data:image/svg+xml;base64,' + Buffer.from(`<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><path d="M0,60 L400,60 L400,50 L380,50 L370,30 L360,50 L320,50 L310,20 L300,50 L250,50 L230,15 L220,0 L210,15 L190,50 L140,50 L130,20 L120,50 L80,50 L70,30 L60,50 L0,50 Z" fill="#3A1059"/></svg>`).toString('base64') + '")',
                backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'
              }} />

              <h2 className="font-bold text-sm uppercase tracking-[0.25em] text-[#F3E8FF] text-center mt-2 mb-1 font-sans">✦ COUNTDOWN ✦</h2>
              <div className="flex justify-center gap-1.5 mb-8">
                <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B5BBF]" />
                <span className="w-1 h-1 rounded-full bg-[#9B5BBF] opacity-60" />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center z-10 pb-8">
                <div className="rounded-[24px] px-8 py-6 w-full max-w-[320px] relative flex justify-center" style={{ border: '1px solid #3A1059' }}>
                  {/* Corner diamonds */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#9B5BBF] transform rotate-45" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#9B5BBF] transform rotate-45" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#9B5BBF] transform rotate-45" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#9B5BBF] transform rotate-45" />
                  
                  <CountdownTimer targetDate={FEST_DATE} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 04 · DIGITAL GATE PASS */}
        <div className="relative flex flex-col h-full mt-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none opacity-40 z-0"
            style={{ background: 'radial-gradient(circle, #D4A820 0%, transparent 70%)', filter: 'blur(15px)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #D4A820, #7A5C00)', boxShadow: '0 0 15px rgba(212,168,32,0.5)' }}>
            04
          </div>
          
          <div className="flex-1 flex flex-col items-center rounded-[20px] p-6 lg:p-10 relative overflow-hidden z-10"
            style={{ background: 'linear-gradient(180deg, #1F1704 0%, #0E0A02 100%)', border: '1px solid #59450C', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ backgroundImage: `url("${goldMotif}")`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

            <h2 className="font-bold text-sm uppercase tracking-[0.25em] text-[#FEF3C7] text-center mt-2 mb-1 font-sans">✦ DIGITAL GATE PASS ✦</h2>
            <div className="flex justify-center gap-1.5 mb-8">
              <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#B48C0A]" />
              <span className="w-1 h-1 rounded-full bg-[#B48C0A] opacity-60" />
            </div>

            {isApproved && userData?.entry_code ? (
              <div className="w-full flex flex-col items-center flex-1 z-10">
                <div className="bg-white p-4 rounded-[20px] mb-8 w-64 h-64 flex items-center justify-center shadow-xl">
                  <QRDisplay value={userData.entry_code} size={224} downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`} />
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-4 mb-8 font-bold uppercase tracking-[0.1em] text-[10px] text-[#B48C0A] hover:bg-white/5 transition-all"
                  style={{ background: '#291A05', border: '1px solid #59450C' }}>
                  <Download size={14} /> DOWNLOAD QR
                </button>

                <div className="w-full rounded-xl p-5 mt-auto text-left" style={{ background: '#1A1102', border: '1px solid #4D3308' }}>
                  <p className="font-black text-sm uppercase text-white mb-1">{userData?.full_name}</p>
                  <p className="text-[#8B7C62] text-[10px] mb-4 truncate">{userData?.email}</p>
                  <div className="flex gap-3">
                    <span className="flex-1 text-center text-[9px] font-bold uppercase py-2 rounded-lg" style={{ background: '#1A1102', color: '#B48C0A', border: '1px solid #4D3308' }}>
                      {userData?.batch || 'Batch TBD'}
                    </span>
                    <span className="flex-1 text-center text-[9px] font-bold uppercase py-2 rounded-lg" style={{ background: '#1A1102', color: '#B48C0A', border: '1px solid #4D3308' }}>
                      {userData?.zone || 'Zone TBD'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 w-full z-10 opacity-80">
                <div className="mb-4">
                  <Lock size={32} color="#B48C0A" />
                </div>
                <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#B48C0A] mb-8">PASS LOCKED</p>
                <Link href="/payment" className="w-full mt-auto">
                  <div className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold uppercase tracking-[0.1em] text-[10px] text-[#B48C0A] hover:bg-white/5 transition-all"
                    style={{ background: '#291A05', border: '1px solid #59450C' }}>
                    GO TO PAYMENT <ArrowRight size={14} />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
