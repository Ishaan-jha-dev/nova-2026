'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/timeline', label: 'Timeline' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="glass-dark border-b border-nova-primary/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-nova-primary/20 border border-nova-primary/40 flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                <Zap size={18} className="text-nova-primary" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider gradient-text">
                NOVA
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                    pathname === link.href
                      ? 'text-nova-primary'
                      : 'text-nova-text-dim hover:text-nova-text hover:bg-white/5'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-nova-primary rounded-t-md shadow-[0_-2px_10px_rgba(255,51,102,0.8)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA buttons — auth-aware */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link href="/dashboard" className="glass-cta-btn">
                  <span className="glass-cta-shine" />
                  <span className="relative z-10 font-bold px-2">Enter Nova</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-nova-text-dim hover:text-nova-text transition-colors px-4 py-2">
                    Login
                  </Link>
                  <Link href="/register" className="glass-cta-btn">
                    <span className="glass-cta-shine" />
                    <span className="relative z-10 font-bold px-2">Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-nova-text-dim hover:text-nova-text p-2 rounded-lg hover:bg-white/5"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-nova-primary/20 px-4 py-4 flex flex-col gap-2 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'relative px-4 py-3 rounded-lg text-sm font-medium transition-all overflow-hidden',
                  pathname === link.href
                    ? 'text-nova-primary bg-nova-primary/10 border-l-2 border-nova-primary shadow-[inset_10px_0_20px_-10px_rgba(255,51,102,0.3)]'
                    : 'text-nova-text-dim hover:text-nova-text hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              {user ? (
                <Link href="/dashboard" onClick={() => setOpen(false)} className="glass-cta-btn mt-2 w-full flex justify-center">
                  <span className="glass-cta-shine" />
                  <span className="relative z-10 font-bold">Enter Nova</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="px-4 py-3 text-sm text-nova-text-dim hover:text-nova-text text-center">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="glass-cta-btn mt-2 w-full flex justify-center">
                    <span className="glass-cta-shine" />
                    <span className="relative z-10 font-bold">Register Now</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
