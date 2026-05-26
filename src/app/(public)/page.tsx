import Link from 'next/link'
import { ArrowRight, ArrowDown, Mic2, BriefcaseBusiness, Globe, Palette, Search, Star, Headphones, Users, UserPlus, CalendarCheck, ChevronRight, ChevronDown } from 'lucide-react'
import HeroComponent from '@/components/sections/HeroComponent'
import MaintenanceAlert from '@/components/ui/MaintenanceAlert'
import PaymentStepCard from '@/components/ui/PaymentStepCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Unplugged 2026 | IIM Bangalore Annual Fest',
  description: 'The most electric college fest of IIM Bangalore is here. Cultural events, speaker sessions, competitions, and more — June 2026.',
}

const FEST_DATE = process.env.NEXT_PUBLIC_FEST_DATE || '2026-06-15T09:00:00+05:30'

const features = [
  {
    icon: Mic2,
    title: 'Speaker Sessions & Panels',
    desc: 'Engaging talks by professors, startup founders, and industry experts.',
    color: 'from-amber-500 to-orange-600',
    tag: 'Days 1, 2 & 3',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Case & Pitch Competitions',
    desc: 'High-stakes business case solving and pitch competitions to test your mettle.',
    color: 'from-orange-500 to-red-500',
    tag: 'For Participants',
  },
  {
    icon: Globe,
    title: 'Model UN (MUN)',
    desc: 'Represent nations, debate global issues, and craft resolutions in an immersive experience.',
    color: 'from-yellow-500 to-amber-500',
    tag: 'Days 2 & 3',
  },
  {
    icon: Users,
    title: 'Cultural Extravaganza',
    desc: 'Showcase your moves in Dance & Drama, or claim the title in Mr. and Miss Nova.',
    color: 'from-rose-500 to-orange-600',
    tag: 'For Participants',
  },
  {
    icon: Search,
    title: 'Treasure Hunt & Games',
    desc: 'Campus-wide adventure to test your wits and test your strength in Tug of War.',
    color: 'from-[#E8A020] to-[#F0A500]',
    tag: 'Open to All',
  },
  {
    icon: Star,
    title: 'Talent Show & Quizzes',
    desc: 'From singers to quick thinkers — own the stage and claim your prize in the Finals.',
    color: 'from-orange-400 to-amber-600',
    tag: 'Day 3 & 4',
  },
  {
    icon: Palette,
    title: 'DBE Spotlight',
    desc: 'TEDtalks by DBE students and outreach showcases celebrating student journeys.',
    color: 'from-yellow-600 to-orange-500',
    tag: 'Days 1 & 2',
  },
  {
    icon: Headphones,
    title: 'Jamming & DJ Nights',
    desc: 'Unwind with musical jamming sessions on Day 1 and an electrifying DJ night on Day 3.',
    color: 'from-nova-primary to-nova-accent',
    tag: 'Evenings',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      <HeroComponent />

      {/* ─── How It Works ───────────────────────────────────────── */}
      <section className="py-20 px-4 relative bg-nova-bg z-10">
        {/* Subtle ambient glow / bubble */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-nova-primary/5 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 entrance-1">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-nova-text mb-4 relative inline-block">
              How It Works
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-gradient-to-r from-transparent via-nova-accent to-transparent rounded-full opacity-80" />
            </h2>
            <p className="text-nova-text-dim max-w-xl mx-auto mt-6">
              Your journey to Nova Unplugged 2026 starts here in three simple steps.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative z-10 entrance-2">
            
            {/* Step 1 */}
            <PaymentStepCard paymentLink="https://enidhi.iimb.ac.in/?p_id=68F08B3E4815358A9DD8BE3AB499FB5A" />

            {/* Arrow */}
            <div className="text-nova-primary/50 shrink-0 hidden md:block">
              <ArrowRight size={32} />
            </div>
            <div className="text-nova-primary/50 shrink-0 block md:hidden">
              <ArrowDown size={32} />
            </div>

            {/* Step 2 */}
            <Link 
              href="/login" 
              className="flex-1 w-full md:w-auto nova-card rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-6 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all">
                <UserPlus size={28} />
              </div>
              <div className="absolute top-4 left-6 text-5xl font-black text-white/5 select-none pointer-events-none">2</div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Login / Register</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Create your Nova account or sign in to access your dashboard.
              </p>
            </Link>

            {/* Arrow */}
            <div className="text-nova-accent/50 shrink-0 hidden md:block">
              <ArrowRight size={32} />
            </div>
            <div className="text-nova-accent/50 shrink-0 block md:hidden">
              <ArrowDown size={32} />
            </div>

            {/* Step 3 */}
            <Link 
              href="/dashboard/events" 
              className="flex-1 w-full md:w-auto nova-card rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#00FF88]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 flex items-center justify-center mb-6 text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all">
                <CalendarCheck size={28} />
              </div>
              <div className="absolute top-4 left-6 text-5xl font-black text-white/5 select-none pointer-events-none">3</div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Enrol & Connect</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Register for events, form teams, and get notified about updates.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────── */}
      <section className="py-24 px-4 relative bg-nova-bg z-10 border-t border-white/5">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-nova-primary/5 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 entrance-1">
            <p className="text-nova-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">4 Days · Unforgettable Experiences</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-nova-text mb-4 relative inline-block">
              What&apos;s in store for you?
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gradient-to-r from-transparent via-nova-primary to-transparent rounded-full opacity-80" />
            </h2>
            <p className="text-nova-text-dim max-w-xl mx-auto mt-6">
              Nova Unplugged 2026 is more than a fest. Four days of culture, competition, and connection. Here is what the nature of events looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              const delayClass = `entrance-${(i % 5) + 1}`
              return (
                <div
                  key={f.title}
                  className={`bento-item shimmer-card group ${delayClass} flex flex-col items-center text-center`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(232, 160, 32,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(232, 160, 32,0.4)]`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-body font-bold text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{f.desc}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70">
                    {f.tag}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <MaintenanceAlert />
    </div>
  )
}
