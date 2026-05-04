import Link from 'next/link'
import { Countdown } from '@/components/ui/Countdown'
import { ArrowRight, Music, Code2, Trophy, QrCode, Users, Star } from 'lucide-react'
import HeroComponent from '@/components/sections/HeroComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Unplugged 2025 | IIM Bangalore Annual Fest',
  description: 'The most electric college fest of IIM Bangalore is here. Cultural events, tech battles, sports, and more — June 2025.',
}

const FEST_DATE = process.env.NEXT_PUBLIC_FEST_DATE || '2025-06-20T09:00:00+05:30'

const features = [
  {
    icon: Music,
    title: 'Cultural Events',
    desc: 'Dance, music, drama, fashion — express yourself on the biggest stage.',
    color: 'from-red-600 to-rose-600',
  },
  {
    icon: Code2,
    title: 'Tech Battles',
    desc: 'Hackathons, quizzes, case studies — prove your intellect.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Trophy,
    title: 'Sports Arena',
    desc: 'Cricket, football, basketball — compete, sweat, win.',
    color: 'from-orange-600 to-amber-600',
  },
  {
    icon: QrCode,
    title: 'Smart Entry',
    desc: 'Your unique QR code is your ticket. Verified, secure, instant.',
    color: 'from-pink-600 to-fuchsia-600',
  },
  {
    icon: Users,
    title: 'Team Play',
    desc: 'Create or join teams. Build squads, compete together, win together.',
    color: 'from-nova-primary to-nova-accent',
  },
  {
    icon: Star,
    title: '1000+ Students',
    desc: 'Connect with the brightest minds from across India.',
    color: 'from-amber-500 to-orange-600',
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      <HeroComponent />

      {/* ─── Features Grid ────────────────────────────────────── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-nova-text mb-4">
              What&apos;s in store for you?
            </h2>
            <p className="text-nova-text-dim max-w-xl mx-auto">
              Nova Unplugged is more than a fest. It&apos;s an experience. Something to remember.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className={`bento-item`}
                >
                  <div className={`bento-icon-wrapper w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg transition-all duration-500`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-nova-text mb-2 text-center">{f.title}</h3>
                  <p className="text-nova-text-dim text-sm leading-relaxed text-center">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-10 text-center relative overflow-hidden glow-border-pink">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl opacity-30" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-4">
                Ready to plug in?
              </h2>
              <p className="text-nova-text-dim mb-8 text-lg">
                Register with your IIMB email, submit payment, and unlock the full Nova experience.
              </p>
              <Link
                href="/register"
                className="glass-cta-btn"
              >
                <span className="glass-cta-shine" />
                <span className="relative z-10 font-bold flex items-center gap-2">Get Started <ArrowRight size={20} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
