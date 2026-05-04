import type { Metadata } from 'next'
import { Zap, Target, Heart, Code2, Palette, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Nova Unplugged 2026',
  description: 'Learn about Nova Unplugged — the annual college fest of IIM Bangalore, its story, and the organising committee.',
}

const team = [
  {
    name: 'Madhwendra Shukla',
    role: 'Developer',
    title: 'Core Logic & Backend',
    emoji: '⚡',
    color: 'from-nova-primary to-rose-600',
    brag: [
      'Architected the entire platform from scratch',
      'Built real-time auth, RLS policies & Supabase backend',
      'Engineered QR-based smart entry & payment verification system',
      'Designed the database schema, API layer & middleware',
    ],
    badge: 'Full-Stack Engineer',
  },
  {
    name: 'Ishaan Jha',
    role: 'Developer',
    title: 'UI/UX & Frontend',
    emoji: '🎨',
    color: 'from-violet-600 to-fuchsia-600',
    brag: [
      'Crafted the premium neon-glassmorphism design language',
      'Built every pixel of the student & admin dashboards',
      'Designed fluid animations and micro-interactions',
      'Ensured mobile-first, accessible, responsive layouts',
    ],
    badge: 'Design Engineer',
  },
  {
    name: 'Ashutosh Agarwaal',
    role: 'Coordinator',
    title: 'OC Lead · ZR North Zone 2',
    emoji: '🏆',
    color: 'from-amber-500 to-orange-600',
    brag: [
      'Heads the Organising Committee for North Zone 2',
      'Coordinates logistics, events & participant experience',
      'Bridges on-ground execution with the tech platform',
      'Drives student outreach and zone-level registrations',
    ],
    badge: 'OC Lead',
  },
]

const values = [
  { icon: Zap,    title: 'Energy',     desc: 'We bring unmatched enthusiasm and drive to everything we do.' },
  { icon: Target, title: 'Excellence', desc: 'Raising the bar, year after year, in every event and experience.' },
  { icon: Heart,  title: 'Community',  desc: 'Building bonds across batches, campuses, and backgrounds.' },
]

const roleIcon: Record<string, any> = {
  Developer: Code2,
  Coordinator: Crown,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-nova-bg">
      {/* Ambient glowing orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[60vw] h-[60vw] bg-nova-primary/10 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-0 -right-1/4 w-[50vw] h-[50vw] bg-nova-accent/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      </div>
      <div className="absolute inset-0 mesh-bg opacity-30" />

      {/* Hero */}
      <section className="relative py-24 px-4 text-center entrance-1">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-display font-black text-5xl sm:text-7xl gradient-text mb-8">
            The Nova Story
          </h1>
          <p className="text-nova-text-dim text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Nova Unplugged is the annual college fest of IIM Bangalore — four days of culture,
            intellect, and connection. Born from the belief that the best business leaders are also
            the most well-rounded individuals, Nova 2026 celebrates every dimension of human potential.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 entrance-2">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-nova-text mb-4 relative inline-block">
              What We Stand For
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-nova-primary to-transparent opacity-50" />
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon
              const delayClass = `entrance-${(i % 3) + 2}`
              return (
                <div key={v.title} className={`nova-card shimmer-card p-10 text-center ${delayClass} group`}>
                  <div className="w-16 h-16 rounded-2xl bg-nova-primary/10 border border-nova-primary/30 flex items-center justify-center mx-auto mb-6 relative overflow-hidden group-hover:border-nova-primary transition-colors">
                    <div className="absolute inset-0 bg-nova-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon size={30} className="text-nova-primary relative z-10" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-nova-text mb-4">{v.title}</h3>
                  <p className="text-nova-text-dim text-base leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 entrance-1">
            <p className="text-nova-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">The People Behind It</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-nova-text mb-4">
              Built by DBE Students
            </h2>
            <div className="w-24 h-1 bg-nova-primary mx-auto rounded-full mb-6 opacity-30" />
            <p className="text-nova-text-dim max-w-xl mx-auto text-lg">
              Built by students, for students. Proudly made at IIM Bangalore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => {
              const RoleIcon = roleIcon[member.role] || Zap
              return (
                <div
                  key={member.name}
                  className={`nova-card shimmer-card p-8 group entrance-${(i % 3) + 1} flex flex-col`}
                >
                  {/* Avatar + badge */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative shrink-0">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,51,102,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        {member.emoji}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-nova-text text-lg leading-tight group-hover:text-nova-primary transition-colors truncate">
                        {member.name}
                      </p>
                      <p className="text-nova-text-dim text-sm">{member.title}</p>
                      <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-nova-primary/10 border border-nova-primary/25 text-nova-primary">
                        <RoleIcon size={10} />
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                  {/* Brag list */}
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {member.brag.map((line, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-nova-text-dim leading-snug">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-nova-primary shrink-0 opacity-70" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="nova-card rounded-3xl p-12 text-center relative overflow-hidden glow-border-pink entrance-3 group">
            <div className="absolute inset-0 bg-nova-primary/10 blur-[100px] opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display font-black text-4xl sm:text-5xl gradient-text mb-6">
                Get in Touch
              </h2>
              <p className="text-nova-text-dim text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                Questions? Sponsorships? Partnerships? We&apos;d love to hear from you.
              </p>
              <a
                href="mailto:novaunplugged@iimb.ac.in"
                className="nova-btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-lg shadow-[0_0_30px_rgba(255,51,102,0.3)] hover:shadow-[0_0_50px_rgba(255,51,102,0.5)] transition-all hover:-translate-y-1"
              >
                📧 <span className="tracking-tight">novaunplugged@iimb.ac.in</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
