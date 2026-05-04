import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatIST, getDaysRemaining } from '@/lib/utils/dateUtils'
import { Calendar, Users, QrCode, Bell, ArrowRight, Zap, Star } from 'lucide-react'
import { PaymentBadge } from '@/components/ui/Badge'
import { CategoryBadge } from '@/components/ui/Badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | Nova Unplugged 2026' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: _userData }, { data: _registrations }, { data: _announcements }] = await Promise.all([
    supabase.from('users').select('*, user_roles(name, permissions_level)').eq('id', user.id).single(),
    supabase.from('registrations').select('*, events(title, category_id, event_date, start_time, participation_type, categories(title))').eq('user_id', user.id).limit(5),
    supabase.from('announcements').select('*, users(full_name)').order('created_at', { ascending: false }).limit(5),
  ])
  // Cast to bypass Supabase v2 join type inference limitations
  const userData = _userData as { full_name: string; payment_status: string; [key: string]: unknown } | null
  const registrations = _registrations as any[] | null
  const announcements = _announcements as any[] | null

  const firstName = userData?.full_name?.split(' ')[0] || 'there'
  const FEST_DATE = process.env.NEXT_PUBLIC_FEST_DATE || '2026-06-15T09:00:00+05:30'
  const daysToFest = getDaysRemaining(FEST_DATE)

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 entrance-1">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-nova-muted text-sm font-display tracking-wider uppercase mb-1">Welcome back</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-nova-text">
              Hey, <span className="gradient-text">{firstName}</span> ⚡
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-nova-accent/10 border border-nova-accent/20">
              <Zap size={14} className="text-nova-accent animate-pulse" />
              <span className="text-xs font-semibold text-nova-accent tracking-wide uppercase">
                {daysToFest} days to fest
              </span>
            </div>
            <PaymentBadge status={(userData?.payment_status || 'pending') as 'pending' | 'approved' | 'rejected'} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Events Joined',    value: registrations?.length || 0,  icon: Calendar, color: 'text-nova-primary', bg: 'bg-nova-primary/10' },
          { label: 'Days to Fest',     value: daysToFest,                   icon: Zap,      color: 'text-nova-accent',  bg: 'bg-nova-accent/10'  },
          { label: 'Teams Active',     value: registrations?.filter(r => r.events && (r.events as any).participation_type === 'team').length || 0, icon: Users, color: 'text-nova-success', bg: 'bg-nova-success/10' },
          { label: 'Announcements',    value: announcements?.length || 0,   icon: Bell,     color: 'text-nova-warning', bg: 'bg-nova-warning/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          const delayClass = `entrance-${(i % 5) + 1}`
          return (
            <div key={stat.label} className={`nova-card shimmer-card p-5 ${delayClass}`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shadow-[0_0_15px_rgba(var(--${stat.color}-rgb),0.3)]`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <p className={`stat-value ${stat.color} mb-1`} data-value={stat.value}>{stat.value}</p>
              <p className="text-nova-muted text-xs font-display tracking-wider uppercase">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registered Events */}
        <div className="lg:col-span-2 nova-card p-6 entrance-2 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-nova-text flex items-center gap-2 text-lg">
              <Calendar size={18} className="text-nova-primary" /> My Events
            </h2>
            <Link href="/dashboard/my-events" className="text-xs text-nova-primary hover:text-nova-primary-light flex items-center gap-1 transition-colors group">
              View all <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {registrations && registrations.length > 0 ? (
            <div className="flex flex-col gap-3">
              {registrations.map(reg => {
                const ev = reg.events as any
                const isTeam = ev?.participation_type === 'team'
                return (
                  <div key={reg.id} className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-nova-primary/40 transition-all hover:-translate-y-0.5 overflow-hidden">
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-nova-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-nova-primary to-nova-accent shrink-0 relative z-10" />
                    
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-nova-text font-medium text-sm truncate">{ev?.title}</p>
                        {isTeam && <span className="tag-pill-amber"><Users size={10} className="inline mr-1" /> Team</span>}
                      </div>
                      <p className="text-nova-text-dim text-xs">
                        {ev?.event_date ? `${ev.event_date}${ev.start_time ? ` · ${ev.start_time}` : ''}` : 'Date TBD'}
                      </p>
                    </div>
                    <div className="relative z-10 hidden sm:block">
                      {ev?.categories?.title && <span className="tag-pill">{ev.categories.title}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 relative">
                <Calendar size={24} className="text-nova-muted" />
                <div className="absolute inset-0 bg-nova-primary/20 blur-xl rounded-full opacity-50" />
              </div>
              <p className="text-nova-text font-medium mb-1">No events registered yet</p>
              <p className="text-nova-text-dim text-sm mb-5">Explore the fest and join the action.</p>
              <Link href="/dashboard/events" className="nova-btn-primary px-6 py-2 rounded-lg text-sm">
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* QR Card */}
          <div className={`nova-card p-6 entrance-3 ${userData?.payment_status === 'approved' ? 'border-nova-success/40' : 'border-nova-primary/20'}`}>
            {userData?.payment_status !== 'approved' && (
              <div className="absolute inset-0 backdrop-blur-md bg-nova-bg/70 z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-nova-warning/20 border border-nova-warning/40 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-nova-warning/20 blur-md rounded-full animate-pulse" />
                  <span className="text-xl relative z-10">🔒</span>
                </div>
                <p className="text-nova-text font-medium text-sm text-center px-4">Payment Pending</p>
                <p className="text-nova-text-dim text-xs text-center px-4">QR unlocks after approval</p>
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${userData?.payment_status === 'approved' ? 'bg-nova-success/10 text-nova-success' : 'bg-white/5 text-nova-muted'}`}>
                <QrCode size={18} />
              </div>
              <h3 className="font-display font-semibold text-base text-nova-text">Your Gate Pass</h3>
            </div>
            <div className="flex items-center justify-center group cursor-pointer">
              <div className="relative w-32 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-nova-primary/40 group-hover:shadow-[0_0_30px_rgba(255,51,102,0.15)]">
                {userData?.payment_status === 'approved' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nova-primary/20 to-transparent h-[200%] -top-[100%] animate-[scan_3s_linear_infinite]" />
                )}
                <QrCode size={64} className="text-nova-primary/70 group-hover:text-nova-primary transition-colors relative z-10" />
              </div>
            </div>
            {userData?.payment_status === 'approved' && (
              <Link href="/profile" className="mt-6 w-full text-center block text-sm font-medium text-nova-primary hover:text-nova-primary-light transition-colors">
                View & Download <ArrowRight size={14} className="inline ml-1" />
              </Link>
            )}
          </div>

          {/* Announcements */}
          <div className="nova-card p-6 entrance-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-nova-text flex items-center gap-2 text-lg">
                <Bell size={18} className="text-nova-warning" /> Updates
              </h3>
              <Link href="/dashboard/announcements" className="text-xs text-nova-warning hover:text-yellow-400 flex items-center gap-1 transition-colors group">
                View all <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {announcements && announcements.length > 0 ? (
              <div className="flex flex-col gap-4">
                {announcements.map(a => (
                  <div key={a.id} className="relative pl-4 border-l-2 border-nova-warning/50 hover:border-nova-warning transition-colors">
                    <p className="text-nova-text text-sm font-medium mb-1">{a.title}</p>
                    <p className="text-nova-muted text-xs line-clamp-2 leading-relaxed mb-2">{a.body}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-nova-text-dim">
                      {formatIST(a.created_at, 'MMM d, h:mm a')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <Bell size={24} className="text-nova-muted/50 mb-2" />
                <p className="text-nova-muted text-sm text-center">No announcements yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
