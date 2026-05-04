'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Zap, LayoutDashboard, Calendar, BookMarked, User, LogOut, Info, Clock, Bell, Menu, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/components/ui/Button'

const studentNav = [
  { href: '/dashboard',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/dashboard/announcements', label: 'Announcements', icon: Bell },
  { href: '/dashboard/events',    label: 'Events',     icon: Calendar },
  { href: '/dashboard/my-events', label: 'My Events',  icon: BookMarked },
  { href: '/dashboard/timeline',  label: 'Timeline',   icon: Clock },
  { href: '/profile',             label: 'Profile',    icon: User },
  { href: '/dashboard/about',     label: 'About',      icon: Info },
]

interface StudentSidebarProps {
  userName: string
  userEmail: string
  initials: string
}

export function StudentSidebar({ userName, userEmail, initials }: StudentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-nova-bg/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 hidden md:block">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nova-primary/20 border border-nova-primary/40 flex items-center justify-center">
            <Zap size={18} className="text-nova-primary" />
          </div>
          <span className="font-display font-bold gradient-text tracking-wider block leading-none">NOVA</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {studentNav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group overflow-hidden',
                active
                  ? 'nav-link-active'
                  : 'text-nova-text-dim hover:text-nova-text hover:bg-white/5'
              )}
            >
              <Icon size={18} className={active ? 'text-nova-primary' : 'group-hover:text-nova-primary transition-colors'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-nova-primary/30 border border-nova-primary/40 flex items-center justify-center text-xs font-bold text-nova-primary font-display shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-nova-text truncate">{userName}</p>
            <p className="text-xs text-nova-muted truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-nova-muted hover:text-red-400 hover:bg-red-500/10 transition-all mt-1"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-dark border-r border-nova-primary/20 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass-dark border-b border-nova-primary/20 flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap size={18} className="text-nova-primary" />
          <span className="font-display font-bold gradient-text text-sm">NOVA</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="text-nova-text-dim hover:text-nova-text p-2 rounded-lg">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute top-14 left-0 bottom-0 w-64 glass-dark border-r border-nova-primary/20 animate-slide-right">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
