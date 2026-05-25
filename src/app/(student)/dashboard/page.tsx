import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getDaysRemaining, formatIST } from '@/lib/utils/dateUtils'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { Calendar, Users, Bell, ArrowRight, Lock, Mail, Phone, MapPin, Zap, BookOpen, User, Star, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

const Pin = ({ color = 'pink' }: { color?: 'pink' | 'orange' | 'blue' | 'purple' }) => {
  const styles = {
    pink: 'bg-[radial-gradient(circle_at_30%_30%,#ff758c,#FF3366)] shadow-[0_5px_15px_rgba(255,51,102,0.6)]',
    orange: 'bg-[radial-gradient(circle_at_30%_30%,#ffb366,#f37335)] shadow-[0_5px_15px_rgba(243,115,53,0.6)]',
    blue: 'bg-[radial-gradient(circle_at_30%_30%,#6DD5FA,#2980B9)] shadow-[0_5px_15px_rgba(41,128,185,0.6)]',
    purple: 'bg-[radial-gradient(circle_at_30%_30%,#d896ff,#8e44ad)] shadow-[0_5px_15px_rgba(142,68,173,0.6)]',
  }

  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
      <div className={`w-6 h-6 rounded-full ${styles[color]} border-t border-white/40 flex items-center justify-center transform hover:scale-110 transition-transform`}>
        <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute top-[4px] left-[4px] blur-[0.5px]" />
      </div>
      <div className="w-1.5 h-3 bg-black/40 rounded-full -mt-2 transform skew-x-12 blur-[1.5px] z-[-1]" />
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

  const FEST_DATE = process.env.NEXT_PUBLIC_FEST_DATE || '2026-06-15T09:00:00+05:30'
  const daysToFest = getDaysRemaining(FEST_DATE)

  const cardBase = "bg-[#fcfdfd] rounded-[24px] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-slate-200 hover:-translate-y-3 transition-all duration-300 h-full flex flex-col items-center relative overflow-hidden group"

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex justify-center pt-28 pb-20 text-white"
      style={{
        backgroundColor: '#0c0d10',
        backgroundImage: `radial-gradient(circle at center, #2a2b30 1.5px, transparent 1.5px)`,
        backgroundSize: '36px 36px',
        backgroundPosition: '0 0'
      }}
    >
      {/* Decorative Dashed Path (Mind-map vibe) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 200 Q 400 50, 700 300 T 1300 150" fill="transparent" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 8" />
      </svg>

      <div className="w-full max-w-[1300px] px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-wider text-white drop-shadow-md">
            Nova Unplugged <span className="text-[#FF3366]">Dashboard</span>
          </h1>
          <p className="text-white/50 font-medium mt-3 uppercase tracking-widest text-sm">Welcome back, {userData?.full_name?.split(' ')[0]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14">
          
          {/* Card 1: ID Card / Polaroid */}
          <div className="relative">
            <Pin color="pink" />
            <div className={`${cardBase} hover:shadow-[0_20px_40px_rgba(255,51,102,0.2)] hover:border-[#FF3366]/40`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
              
              <div className="w-12 h-12 bg-[#FF3366]/10 rounded-2xl flex items-center justify-center mb-4 text-[#FF3366] font-display font-black text-2xl relative z-10 shadow-sm">
                01
              </div>

              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-slate-800 mb-6 text-center relative z-10">Digital Gate Pass</h2>
              
              {isApproved && userData?.entry_code ? (
                <div className="w-full flex justify-center mb-6 relative z-10">
                  <QRDisplay
                    value={userData.entry_code}
                    size={220}
                    downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                  />
                </div>
              ) : (
                <div className="text-center flex flex-col items-center py-8 mb-6 bg-slate-50 rounded-xl w-full border border-slate-100 relative z-10">
                  <Lock size={36} className="text-[#FF3366] mb-3 animate-pulse" />
                  <p className="font-display font-black text-lg uppercase tracking-wider text-slate-700">Pass Locked</p>
                  <p className="text-slate-500 text-xs mt-2 mb-4 max-w-[180px]">Complete payment to unlock your pass</p>
                  <Link 
                    href="/payment" 
                    className="inline-flex items-center gap-1.5 bg-[#FF3366] hover:bg-[#d62452] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all"
                  >
                    Go to Payment Page →
                  </Link>
                </div>
              )}
              
              <div className="w-full bg-slate-50 rounded-xl p-4 mt-auto border border-slate-100 relative z-10">
                <p className="font-black text-sm uppercase text-slate-800 leading-tight mb-1">{userData?.full_name}</p>
                <p className="text-slate-500 text-xs font-medium mb-3 truncate">{userData?.email}</p>
                <div className="flex justify-between items-center text-[10px] font-black text-[#FF3366] uppercase bg-[#FF3366]/10 px-3 py-2 rounded-lg">
                  <span>{userData?.batch || 'Batch TBD'}</span>
                  <span>{userData?.zone || 'Zone TBD'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Events Summary */}
          <div className="relative">
            <Pin color="orange" />
            <div className={`${cardBase} hover:shadow-[0_20px_40px_rgba(243,115,53,0.2)] hover:border-[#f37335]/40`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
              
              <div className="w-12 h-12 bg-[#f37335]/10 rounded-2xl flex items-center justify-center mb-4 text-[#f37335] font-display font-black text-2xl relative z-10 shadow-sm">
                02
              </div>

              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-slate-800 mb-2 text-center relative z-10">My Events</h2>
              
              <div className="bg-[#f37335] text-white border border-[#f37335] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm relative z-10">
                Registered: {registrations ? registrations.length : 0} Events
              </div>

              <div className="w-full space-y-3 flex-1 relative z-10">
                {registrations && registrations.length > 0 ? (
                  registrations.map(reg => {
                    const ev = reg.events as any
                    return (
                      <div key={reg.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start justify-between hover:border-[#f37335]/40 transition-colors">
                        <div>
                          <p className="font-black text-sm uppercase text-slate-800">{ev?.title}</p>
                          <p className="text-slate-500 text-xs font-medium mt-1">
                            {ev?.event_date ? `${ev.event_date}${ev.start_time ? ` · ${ev.start_time}` : ''}` : 'Date TBD'}
                          </p>
                        </div>
                        <span className="bg-white text-[#f37335] border border-[#f37335]/20 text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm">
                          {ev?.categories?.title || 'Event'}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <Star size={24} className="text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-400 uppercase tracking-wide text-sm">No Events Registered</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 w-full mt-6 relative z-10">
                <Link href="/dashboard/events?tab=my-events" className="w-full flex items-center justify-center gap-2 bg-[#f37335] hover:bg-[#d65f24] text-white shadow-[0_4px_15px_rgba(243,115,53,0.3)] rounded-xl px-5 py-3 transition-all font-bold uppercase tracking-wider text-xs group/btn relative">
                  Manage My Registrations
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard/events" className="text-[#f37335] text-center font-bold uppercase tracking-widest text-[10px] hover:text-[#d65f24] transition-colors underline underline-offset-4 decoration-[#f37335]/30">
                  Browse All Events →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="flex flex-col gap-10 xl:gap-14">
            
            {/* Card 3: Updates */}
            <div className="relative flex-1">
              <Pin color="blue" />
              <div className={`${cardBase} hover:shadow-[0_20px_40px_rgba(41,128,185,0.2)] hover:border-[#2980B9]/40`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
                
                <div className="w-12 h-12 bg-[#2980B9]/10 rounded-2xl flex items-center justify-center mb-4 text-[#2980B9] font-display font-black text-2xl relative z-10 shadow-sm">
                  03
                </div>
                <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 mb-5 text-center relative z-10">Live Updates</h2>
                
                <div className="w-full flex-1 relative z-10">
                  {announcements && announcements.length > 0 ? (
                    <ul className="space-y-3">
                      {announcements.map(ann => (
                        <li key={ann.id} className="bg-slate-50 rounded-xl p-3 border border-[#2980B9]/20">
                          <p className="text-slate-800 font-bold text-xs leading-snug mb-1">{ann.title}</p>
                          <p className="text-[#2980B9] text-[9px] font-black uppercase tracking-widest">{formatIST(ann.created_at, 'MMM d, h:mm a')}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-slate-500 font-bold text-xs">Welcome to Nova Unplugged 26!</p>
                    </div>
                  )}
                </div>

                <Link href="/dashboard/announcements" className="text-[#2980B9] font-black uppercase tracking-widest text-[10px] hover:text-[#1f6390] transition-colors mt-4 relative z-10 underline underline-offset-4 decoration-[#2980B9]/30 hover:decoration-[#2980B9]">
                  View All Announcements
                </Link>
              </div>
            </div>

            {/* Card 4: Countdown */}
            <div className="relative flex-1">
              <Pin color="purple" />
              <div className={`${cardBase} hover:shadow-[0_20px_40px_rgba(142,68,173,0.2)] hover:border-[#8e44ad]/40`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
                
                <div className="w-12 h-12 bg-[#8e44ad]/10 rounded-2xl flex items-center justify-center mb-4 text-[#8e44ad] font-display font-black text-2xl relative z-10 shadow-sm">
                  04
                </div>
                <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 mb-3 relative z-10">Countdown</h2>
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#d896ff] to-[#8e44ad] border border-[#8e44ad]/30 w-full rounded-2xl py-6 relative overflow-hidden z-10 shadow-inner group-hover:shadow-[0_0_20px_rgba(142,68,173,0.3)] transition-all">
                  <div className="absolute inset-0 bg-white/10 blur-[2px]" />
                  <h3 className="font-display font-black text-6xl text-white drop-shadow-md relative z-10 leading-none">{daysToFest}</h3>
                  <p className="text-white font-bold text-[10px] uppercase tracking-widest mt-2 relative z-10 drop-shadow-sm">Days to Nova</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
