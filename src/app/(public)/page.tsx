import HeroComponent from '@/components/sections/HeroComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Unplugged 2026 | IIM Bangalore Annual Fest',
  description: 'The most electric college fest of IIM Bangalore is here. Cultural events, speaker sessions, competitions, and more — June 2026.',
}

export default function HomePage() {
  return (
    <div className="relative">
      <HeroComponent />
    </div>
  )
}
