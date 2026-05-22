import type { Metadata } from 'next'
import ComingSoonClient from './ComingSoonClient'

export const metadata: Metadata = {
  title: 'Coming Soon | Nova Unplugged 2026',
  description: 'Registration opens 26th May. Join our WhatsApp group for updates.',
}

export default function ComingSoon() {
  return <ComingSoonClient />
}
