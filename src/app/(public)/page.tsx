import Link from 'next/link'
import { ArrowRight, Mic2, BriefcaseBusiness, Globe, Palette, Search, Star, Headphones, Users } from 'lucide-react'
import HeroComponent from '@/components/sections/HeroComponent'
import MaintenanceAlert from '@/components/ui/MaintenanceAlert'
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

      {/* ─── Features Grid ────────────────────────────────────── */}
      <section className="py-24 px-4 relative bg-nova-bg z-10">
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

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4 relative bg-nova-bg z-10">
        <div className="max-w-4xl mx-auto">
          <div className="nova-card rounded-3xl p-10 text-center relative overflow-hidden glow-border-pink entrance-3 group">
            <div className="absolute inset-0 bg-nova-primary/10 blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nova-accent/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-4">
                Ready to plug in?
              </h2>
              <p className="text-nova-text-dim mb-8 text-lg">
                Complete your payment on the official IIMB portal first. 
                <br className="hidden sm:block" />
                Then login here using the same email ID to unlock your dashboard.
              </p>
              <Link
                href="/dashboard"
                className="nova-btn-primary rounded-full px-8 py-4 text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232, 160, 32,0.4)] hover:shadow-[0_0_50px_rgba(232, 160, 32,0.6)] group-hover:-translate-y-1 relative z-20 inline-block"
              >
                <span className="relative z-10 font-bold flex items-center gap-2">Enter Nova <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MaintenanceAlert />
    </div>
  )
}
