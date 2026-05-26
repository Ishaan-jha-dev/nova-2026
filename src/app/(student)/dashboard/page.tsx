import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getDaysRemaining, formatIST } from '@/lib/utils/dateUtils'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { Calendar, Users, Bell, ArrowRight, Lock, Mail, Phone, MapPin, Zap, BookOpen, User, Star, ChevronRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import type { Metadata } from 'next'
import { WelcomeBackHeading } from '@/components/ui/CustomHeadings'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

const Pin = ({ color = 'pink' }: { color?: 'pink' | 'orange' | 'blue' | 'purple' }) => {
  const styles = {
    pink: 'bg-[radial-gradient(circle_at_30%_30%,#F0A500,#E8A020)] shadow-[0_5px_15px_rgba(232, 160, 32,0.6)]',
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

  // Target is June 15, 2026, 12:00 AM IST. (IST is UTC+5:30)
  // 12:00 AM IST on June 15 is June 14, 18:30:00 UTC.
  const FEST_DATE = '2026-06-15T00:00:00+05:30'

  const cardBase = "bg-[#111111] rounded-[24px] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-white/10 hover:-translate-y-3 transition-all duration-300 h-full flex flex-col items-center relative overflow-hidden group w-full"

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
        <div className="text-center mb-10 relative z-10 flex flex-col items-center">
          <WelcomeBackHeading />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14">
          
          {/* Card 1: Events Summary */}
          <div className="relative">
            <Pin color="orange" />
            <Link href="/dashboard/events" className={`${cardBase} hover:shadow-[0_20px_40px_rgba(243,115,53,0.2)] hover:border-[#f37335]/40`}>
              <div className="hidden" />
              
              <div className="w-12 h-12 bg-[#f37335]/10 rounded-2xl flex items-center justify-center mb-4 text-[#f37335] font-display font-black text-2xl relative z-10 shadow-sm group-hover:scale-110 transition-transform">
                01
              </div>

              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-2 text-center relative z-10">My Events</h2>
              
              <div className="bg-[#f37335] text-white border border-[#f37335] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm relative z-10">
                Registered: {registrations ? registrations.length : 0} Events
              </div>

              <div className="w-full space-y-3 flex-1 relative z-10">
                {registrations && registrations.length > 0 ? (
                  registrations.map(reg => {
                    const ev = reg.events as any
                    return (
                      <div key={reg.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start justify-between group-hover:border-[#f37335]/40 transition-colors">
                        <div>
                          <p className="font-black text-sm uppercase text-white">{ev?.title}</p>
                          <p className="text-white/60 text-xs font-medium mt-1">
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
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                      <Star size={24} className="text-white/30" />
                    </div>
                    <p className="font-bold text-white/40 uppercase tracking-wide text-sm">No Events Registered</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col w-full mt-6 relative z-10 items-center justify-center">
                <div className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(45deg,#f37335,transparent)] text-white shadow-[0_0_20px_rgba(243,115,53,0.5)] border border-[#f37335] rounded-xl px-5 py-4 transition-all font-bold uppercase tracking-widest text-xs group-hover:shadow-[0_0_35px_rgba(243,115,53,0.8)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 blur-[5px] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2">Explore All Events <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></span>
                </div>
              </div>
            </Link>
          </div>

          {/* Middle Column: Stacked Cards */}
          <div className="flex flex-col gap-10 xl:gap-14">
            
            {/* Card 2: Updates */}
            <div className="relative flex-1">
              <Pin color="blue" />
              <Link href="/dashboard/announcements" className={`${cardBase} hover:shadow-[0_20px_40px_rgba(41,128,185,0.2)] hover:border-[#2980B9]/40`}>
                <div className="hidden" />
                
                <div className="w-12 h-12 bg-[#2980B9]/10 rounded-2xl flex items-center justify-center mb-4 text-[#2980B9] font-display font-black text-2xl relative z-10 shadow-sm group-hover:scale-110 transition-transform">
                  02
                </div>
                <h2 className="font-display font-black text-xl uppercase tracking-wider text-white mb-5 text-center relative z-10">Live Updates</h2>
                
                <div className="w-full flex-1 relative z-10">
                  {announcements && announcements.length > 0 ? (
                    <ul className="space-y-3">
                      {announcements.map(ann => (
                        <li key={ann.id} className="bg-white/5 rounded-xl p-3 border border-[#2980B9]/20 group-hover:border-[#2980B9]/50 transition-colors">
                          <p className="text-white font-bold text-xs leading-snug mb-1">{ann.title}</p>
                          <p className="text-[#2980B9] text-[9px] font-black uppercase tracking-widest">{formatIST(ann.created_at, 'MMM d, h:mm a')}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-white/60 font-bold text-xs">Welcome to Nova Unplugged 26!</p>
                    </div>
                  )}
                </div>

                <div className="text-[#2980B9] font-black uppercase tracking-widest text-[10px] mt-4 relative z-10 flex items-center gap-1 group-hover:text-[#6DD5FA]">
                  View All Announcements <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Card 3: Countdown */}
            <div className="relative flex-1">
              <Pin color="purple" />
              <div className={`${cardBase} hover:shadow-[0_20px_40px_rgba(142,68,173,0.2)] hover:border-[#8e44ad]/40`}>
                <div className="hidden" />
                
                <div className="w-12 h-12 bg-[#8e44ad]/10 rounded-2xl flex items-center justify-center mb-4 text-[#8e44ad] font-display font-black text-2xl relative z-10 shadow-sm">
                  03
                </div>
                <h2 className="font-display font-black text-xl uppercase tracking-wider text-white mb-3 relative z-10">Countdown</h2>
                <div className="flex flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(216,150,255,0.1),rgba(142,68,173,0.3))] border border-[#8e44ad]/30 w-full rounded-2xl py-6 relative overflow-hidden z-10 shadow-inner group-hover:shadow-[0_0_20px_rgba(142,68,173,0.3)] transition-all">
                  <CountdownTimer targetDate={FEST_DATE} />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Card 4 (ID Card / Polaroid) */}
          <div className="relative">
            <Pin color="pink" />
            <div className={`${cardBase} ${isApproved ? 'cursor-pointer hover:shadow-[0_20px_40px_rgba(232, 160, 32,0.2)] hover:border-[#E8A020]/40' : ''}`}>
              <div className="hidden" />
              
              <div className="w-12 h-12 bg-[#E8A020]/10 rounded-2xl flex items-center justify-center mb-4 text-[#E8A020] font-display font-black text-2xl relative z-10 shadow-sm group-hover:scale-110 transition-transform">
                04
              </div>

              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-6 text-center relative z-10">Digital Gate Pass</h2>
              
              {isApproved && userData?.entry_code ? (
                <Link href="/profile" className="w-full flex flex-col items-center justify-center relative z-10 flex-1">
                  <div className="w-full flex justify-center mb-6 relative z-10 transition-transform group-hover:scale-[1.02]">
                    <QRDisplay
                      value={userData.entry_code}
                      size={220}
                      downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                    />
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-xl p-4 mt-auto border border-white/10 relative z-10 group-hover:border-[#E8A020]/40 transition-colors">
                    <p className="font-black text-sm uppercase text-white leading-tight mb-1">{userData?.full_name}</p>
                    <p className="text-white/60 text-xs font-medium mb-3 truncate">{userData?.email}</p>
                    <div className="flex justify-between items-center text-[10px] font-black text-[#E8A020] uppercase bg-[#E8A020]/10 px-3 py-2 rounded-lg">
                      <span>{userData?.batch || 'Batch TBD'}</span>
                      <span>{userData?.zone || 'Zone TBD'}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="text-center flex flex-col items-center py-8 mb-6 bg-white/5 rounded-xl w-full border border-white/10 relative z-10 flex-1">
                  <Lock size={36} className="text-[#E8A020] mb-3 animate-pulse" />
                  <p className="font-display font-black text-lg uppercase tracking-wider text-white/90">Pass Locked</p>
                  <p className="text-white/60 text-xs mt-2 mb-4 max-w-[180px]">Complete payment to unlock your pass</p>
                  <Link 
                    href="/payment" 
                    className="inline-flex items-center gap-1.5 bg-[#E8A020] hover:bg-[#d62452] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all"
                  >
                    Go to Payment Page →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
