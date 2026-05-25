'use client'

import { useState, useTransition, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatIST } from '@/lib/utils/dateUtils'
import { toZonedTime } from 'date-fns-tz'
import { 
  Search, MapPin, Clock, Users, Phone, ExternalLink, BookOpen, Check, Plus, 
  LogIn, X, Bell, AlertCircle, LogOut, ArrowLeft, ChevronRight, Crown, Copy, 
  UserMinus, Lock, Unlock, ChevronUp, ChevronDown 
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ParticipationBadge, CategoryBadge } from '@/components/ui/Badge'
import { PinnedCard } from '@/components/ui/PinnedCard'
import { createClient } from '@/lib/supabase/client'
import { 
  createJoinRequest, withdrawFromEvent, checkWithdrawalWouldDissolve, respondToJoinRequest 
} from '@/actions/teamRequests'
import type { EventRow, CategoryRow } from '@/lib/supabase/types'

interface EventsClientProps {
  events: (EventRow & { categories?: { id: string; title: string; status: string } | null })[]
  categories: CategoryRow[]
  registeredEventIds: string[]
  registeredTeamIds: Record<string, string>
  requestStatusByTeam: Record<string, string>
  requestStatusByEvent: Record<string, { status: string; teamId: string }>
  registrations: any[]
  userId: string
}

const TZ = 'Asia/Kolkata'

function isDeadlinePassed(deadline: string | null): boolean {
  if (!deadline) return false
  const now = toZonedTime(new Date(), TZ)
  const target = toZonedTime(new Date(deadline), TZ)
  return target < now
}

// Map category title → local static image
const CATEGORY_IMAGES: Record<string, string> = {
  sports:     '/categories/sports.png',
  cultural:   '/categories/culturals.png',
  culturals:  '/categories/culturals.png',
  technical:  '/categories/technicals.png',
  technicals: '/categories/technicals.png',
  fun:        '/categories/fun.png',
}

// Map category → gradient accent for border + glow
const CATEGORY_COLORS: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  sports:     { border: '#E8A020', glow: 'rgba(232, 160, 32,0.5)',   text: '#E8A020', bg: 'rgba(232, 160, 32,0.1)' },
  cultural:   { border: '#F0A500', glow: 'rgba(255,153,51,0.5)',   text: '#F0A500', bg: 'rgba(255,153,51,0.1)' },
  culturals:  { border: '#F0A500', glow: 'rgba(255,153,51,0.5)',   text: '#F0A500', bg: 'rgba(255,153,51,0.1)' },
  technical:  { border: '#FBBF24', glow: 'rgba(251,191,36,0.5)',   text: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
  technicals: { border: '#FBBF24', glow: 'rgba(251,191,36,0.5)',   text: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
  fun:        { border: '#00FF88', glow: 'rgba(0,255,136,0.4)',    text: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
}

function getCategoryColors(title?: string | null) {
  const key = (title || '').toLowerCase()
  return CATEGORY_COLORS[key] || { border: '#E8A020', glow: 'rgba(232, 160, 32,0.4)', text: '#E8A020', bg: 'rgba(232, 160, 32,0.1)' }
}

function getCategoryImage(title?: string | null) {
  const key = (title || '').toLowerCase()
  return CATEGORY_IMAGES[key] || null
}

function getPinColor(title?: string | null): 'pink' | 'orange' | 'blue' | 'purple' {
  const key = (title || '').toLowerCase()
  if (key === 'sports') return 'pink'
  if (key === 'cultural' || key === 'culturals') return 'orange'
  if (key === 'technical' || key === 'technicals') return 'blue'
  return 'purple'
}

// ── Category Overview Page ──────────────────────────────────────────────────
function CategoryGrid({ categories, onSelect }: { categories: CategoryRow[]; onSelect: (id: string) => void }) {
  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* Category Cards */}
      <div className="flex flex-wrap gap-8 justify-center max-w-5xl">
        {categories.map((cat, i) => {
          const pinColor = getPinColor(cat.title)
          const img = getCategoryImage(cat.title)
          return (
            <div
              key={cat.id}
              className="flex-shrink-0"
              style={{
                animation: `fadeSlideUp 0.6s ${i * 0.12 + 0.1}s cubic-bezier(0.16,1,0.3,1) both`,
                width: 240,
                height: 340,
              }}
            >
              <PinnedCard
                pinColor={pinColor}
                onClick={() => onSelect(cat.id)}
                className="h-full"
              >
                {/* Category image poster */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-slate-200/60 shadow-inner">
                  {img ? (
                    <Image
                      src={img}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="240px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <span className="text-5xl opacity-40">⚡</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between">
                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 text-center leading-tight">
                    {cat.title}
                  </h3>
                  
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-nova-primary transition-colors uppercase tracking-widest">
                      Explore <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </PinnedCard>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Stamp-style event poster card ────────────────────────────────────────────
function EventStampCard({
  event,
  isRegistered,
  hasPending,
  onClick,
}: {
  event: EventRow & { categories?: any }
  isRegistered: boolean
  hasPending: boolean
  onClick: () => void
}) {
  const catTitle = (Array.isArray(event.categories) ? event.categories[0] : event.categories)?.title
  const pinColor = getPinColor(catTitle)
  const deadlinePassed = isDeadlinePassed(event.deadline)

  return (
    <div
      className="w-full h-full"
      style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <PinnedCard
        pinColor={pinColor}
        onClick={onClick}
        className="!p-4 h-full flex flex-col justify-between min-h-[300px]"
      >
        {/* Main image area */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-100 flex-shrink-0">
          {event.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-banners/${event.banner_url}`}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <span className="text-4xl opacity-40">
                {catTitle === 'Cultural' || catTitle === 'Culturals' ? '🎭' : catTitle === 'Technical' || catTitle === 'Technicals' ? '💻' : catTitle === 'Sports' ? '🏆' : '⚡'}
              </span>
            </div>
          )}

          {/* Status badge */}
          {isRegistered && (
            <div className="absolute top-2 right-2 z-10 bg-green-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check size={9} /> Joined
            </div>
          )}
          {!isRegistered && hasPending && (
            <div className="absolute top-2 right-2 z-10 bg-amber-500/90 text-slate-900 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Pending
            </div>
          )}
          {deadlinePassed && !isRegistered && (
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-white bg-red-500/90 px-2 py-1 rounded">Closed</span>
            </div>
          )}
        </div>

        {/* Info area */}
        <div className="flex flex-col flex-1 justify-between gap-2">
          <div>
            <h3 className="font-display font-black uppercase leading-tight line-clamp-2 text-slate-800 text-sm tracking-wide">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 font-medium uppercase tracking-wide mt-1">
                {event.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-slate-100">
            {event.venue && (
              <p className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin size={10} className="shrink-0 text-slate-400" />
                <span className="truncate">{event.venue}</span>
              </p>
            )}
            {event.event_date && (
              <p className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock size={10} className="shrink-0 text-slate-400" />
                <span>{event.event_date}</span>
              </p>
            )}
          </div>
        </div>
      </PinnedCard>
    </div>
  )
}

// ── Category Event Grid (Paradox-style listing) ───────────────────────────────
function CategoryEventsView({
  categoryId,
  categories,
  events,
  registeredIds,
  requestStatusByEvent,
  onBack,
  onSelectEvent,
}: {
  categoryId: string
  categories: CategoryRow[]
  events: (EventRow & { categories?: any })[]
  registeredIds: Set<string>
  requestStatusByEvent: Record<string, { status: string; teamId: string }>
  onBack: () => void
  onSelectEvent: (event: EventRow & { categories?: any }) => void
}) {
  const [search, setSearch] = useState('')
  const category = categories.find(c => c.id === categoryId)
  const colors = getCategoryColors(category?.title)

  const filtered = useMemo(() =>
    events.filter(e => {
      const inCat = e.category_id === categoryId
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
      return inCat && matchSearch
    }),
    [events, categoryId, search]
  )

  return (
    <div className="w-full relative z-10">
      {/* Back + header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-x-1"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}40` }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="h-px flex-1 opacity-20" style={{ background: `linear-gradient(90deg, ${colors.border}, transparent)` }} />
      </div>

      {/* Big category title */}
      <div className="text-center mb-10">
        <h1
          className="font-display font-black uppercase"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            letterSpacing: '0.15em',
            background: `linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 40%, ${colors.border} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 40px ${colors.glow})`,
          }}
        >
          {category?.title || 'Events'}
        </h1>
        <div className="w-32 h-0.5 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }} />
      </div>

      {/* Search */}
      <div className="relative max-w-sm mx-auto mb-10">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" style={{ color: colors.text }} />
        <input
          type="text"
          placeholder={`Search ${category?.title || 'events'}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.border}40`,
            color: '#FFE4E6',
          }}
        />
      </div>

      {/* Event stamp grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-lg font-medium">No events found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {filtered.map(event => (
            <EventStampCard
              key={event.id}
              event={event}
              isRegistered={registeredIds.has(event.id)}
              hasPending={!!requestStatusByEvent[event.id]}
              onClick={() => onSelectEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main EventsClient ─────────────────────────────────────────────────────────
export function EventsClient({
  events, categories, registeredEventIds, registeredTeamIds,
  requestStatusByTeam, requestStatusByEvent, registrations, userId
}: EventsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState<'categories' | 'category' | 'search'>('categories')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null)
  const [teamModal, setTeamModal] = useState<'create' | 'browse' | null>(null)
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [browseTeams, setBrowseTeams] = useState<any[]>([])
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [registeredIds, setRegisteredIds] = useState(new Set(registeredEventIds))
  const [withdrawConfirm, setWithdrawConfirm] = useState<{ eventId: string; wouldDissolve: boolean } | null>(null)

  // Merged My Events state and transition functions
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showLeaderPanel, setShowLeaderPanel] = useState<string | null>(null)
  const [leaderRequests, setLeaderRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [requestConfirm, setRequestConfirm] = useState<{ id: string; action: 'accepted' | 'rejected'; name: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') === 'my-events') {
        setActiveTab('my')
      }
    }
  }, [])

  const loadLeaderRequests = async (teamId: string) => {
    setLoadingRequests(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('team_join_requests').select('*, users(full_name, email)').eq('team_id', teamId).eq('status', 'pending')
    setLeaderRequests(data || [])
    setLoadingRequests(false)
  }

  const handleRespondRequest = (requestId: string, action: 'accepted' | 'rejected') => {
    startTransition(async () => {
      try {
        await respondToJoinRequest(requestId, action)
        setLeaderRequests(prev => prev.filter(r => r.id !== requestId))
        setRequestConfirm(null)
        router.refresh()
      } catch (err: any) { alert(err.message) }
    })
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleTeamOpen = (teamId: string, current: boolean) => {
    startTransition(async () => {
      const supabase = createClient() as any
      await supabase.from('teams').update({ is_open: !current }).eq('id', teamId)
      router.refresh()
    })
  }

  const removeMember = (teamId: string, memberId: string, eventId: string) => {
    startTransition(async () => {
      const supabase = createClient() as any
      await supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', memberId)
      await supabase.from('registrations').delete().eq('user_id', memberId).eq('event_id', eventId)
      router.refresh()
    })
  }

  const handleRegisterIndividual = (eventId: string) => {
    setActionError(null)
    startTransition(async () => {
      const supabase = createClient() as any
      const { error } = await supabase.from('registrations').insert({ user_id: userId, event_id: eventId })
      if (error) { setActionError(error.message); return }
      setRegisteredIds(prev => new Set(Array.from(prev).concat(eventId)))
      setSelectedEvent(null)
      router.refresh()
    })
  }

  const handleCreateTeam = (eventId: string) => {
    if (!teamName.trim()) { setActionError('Team name is required'); return }
    setActionError(null)
    startTransition(async () => {
      const supabase = createClient() as any
      const { data: team, error: teamErr } = await supabase
        .from('teams').insert({ event_id: eventId, name: teamName.trim(), leader_id: userId }).select().single()
      if (teamErr || !team) { setActionError(teamErr?.message || 'Team creation failed'); return }
      await supabase.from('team_members').insert({ team_id: team.id, user_id: userId })
      const { error: regErr } = await supabase.from('registrations').insert({ user_id: userId, event_id: eventId, team_id: team.id })
      if (regErr) { setActionError(regErr.message); return }
      setRegisteredIds(prev => new Set(Array.from(prev).concat(eventId)))
      setTeamModal(null); setSelectedEvent(null); setTeamName('')
      router.refresh()
    })
  }

  const handleJoinByCode = (eventId: string) => {
    if (!joinCode.trim()) { setActionError('Enter a join code'); return }
    setActionError(null)
    startTransition(async () => {
      const supabase = createClient() as any
      const { data: team, error: teamErr } = await supabase
        .from('teams').select('*').eq('event_id', eventId).eq('join_code', joinCode.toUpperCase().trim()).eq('is_open', true).single()
      if (teamErr || !team) { setActionError('Invalid or closed team code'); return }
      await supabase.from('team_members').insert({ team_id: team.id, user_id: userId })
      const { error: regErr } = await supabase.from('registrations').insert({ user_id: userId, event_id: eventId, team_id: team.id })
      if (regErr) { setActionError(regErr.message); return }
      setRegisteredIds(prev => new Set(Array.from(prev).concat(eventId)))
      setTeamModal(null); setSelectedEvent(null); setJoinCode('')
      router.refresh()
    })
  }

  const handleRequestJoin = (teamId: string) => {
    setActionError(null)
    startTransition(async () => {
      try {
        await createJoinRequest(teamId)
        router.refresh()
      } catch (err: any) { setActionError(err.message) }
    })
  }

  const loadBrowseTeams = async (eventId: string) => {
    setLoadingTeams(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('teams').select('*, team_members(count), users!leader_id(full_name)')
      .eq('event_id', eventId).eq('is_open', true).eq('status', 'active')
    setBrowseTeams(data || [])
    setLoadingTeams(false)
  }

  const handleWithdrawClick = async (eventId: string) => {
    startTransition(async () => {
      const wouldDissolve = await checkWithdrawalWouldDissolve(eventId, userId)
      setWithdrawConfirm({ eventId, wouldDissolve })
    })
  }

  const confirmWithdraw = () => {
    if (!withdrawConfirm) return
    startTransition(async () => {
      try {
        await withdrawFromEvent(withdrawConfirm.eventId)
        setRegisteredIds(prev => { const s = new Set(Array.from(prev)); s.delete(withdrawConfirm.eventId); return s })
        setWithdrawConfirm(null)
        setSelectedEvent(null)
        router.refresh()
      } catch (err: any) { setActionError(err.message) }
    })
  }

  // ── Search view (all events, no category filter) ─────────
  const searchFiltered = useMemo(() =>
    events.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase())),
    [events, search]
  )

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {/* Tabs Selector */}
      {view !== 'search' && (
        <div className="flex justify-center mt-6 mb-8 relative z-10">
          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab('all')
                if (typeof window !== 'undefined') {
                  window.history.replaceState({}, '', '/dashboard/events')
                }
              }}
              className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#E8A020] to-[#F0A500] text-white shadow-lg shadow-[#E8A020]/20'
                  : 'text-white/65 hover:text-white hover:bg-white/5'
              }`}
            >
              Explore Events
            </button>
            <button
              onClick={() => {
                setActiveTab('my')
                if (typeof window !== 'undefined') {
                  window.history.replaceState({}, '', '/dashboard/events?tab=my-events')
                }
              }}
              className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'my'
                  ? 'bg-gradient-to-r from-[#E8A020] to-[#F0A500] text-white shadow-lg shadow-[#E8A020]/20'
                  : 'text-white/65 hover:text-white hover:bg-white/5'
              }`}
            >
              My Registrations
              {registrations.length > 0 && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-md font-black">
                  {registrations.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {view !== 'search' && activeTab === 'all' && (
        <>
          {view === 'categories' && (
            <div className="w-full py-12 flex flex-col items-center justify-center min-h-[300px]">
              <CategoryGrid 
                categories={categories} 
                onSelect={(id) => {
                  setActiveCategoryId(id)
                  setView('category')
                }} 
              />
            </div>
          )}

          {view === 'category' && activeCategoryId && (
            <CategoryEventsView
              categoryId={activeCategoryId}
              categories={categories}
              events={events}
              registeredIds={registeredIds}
              requestStatusByEvent={requestStatusByEvent}
              onBack={() => { setView('categories'); setActiveCategoryId(null) }}
              onSelectEvent={(e) => { setSelectedEvent(e); setActionError(null) }}
            />
          )}
        </>
      )}

      {view !== 'search' && activeTab === 'my' && (
        <div className="px-6 py-6 max-w-4xl mx-auto relative z-10">
          <div className="mb-8 text-center">
            <h2 className="font-display font-black text-3xl uppercase tracking-wider text-white">My Registered Events</h2>
            <p className="text-white/40 text-sm mt-1">{registrations.length} event{registrations.length !== 1 ? 's' : ''} registered</p>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-20 px-4 sm:px-6 glass rounded-2xl border border-white/10">
              <p className="text-5xl mb-4">🎭</p>
              <p className="text-white/50 text-lg mb-3">You haven&apos;t registered for any events yet</p>
              <button onClick={() => setActiveTab('all')} className="text-[#E8A020] hover:underline font-semibold">Browse events →</button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {registrations.map(reg => {
                const event = reg.events
                const team = reg.teams
                const isLeader = team?.leader_id === userId
                const pinColor = getPinColor(event?.categories?.title)

                return (
                  <div key={reg.id} className="w-full">
                    <PinnedCard pinColor={pinColor} className="!p-6 flex flex-col gap-4">
                      {/* Event header area */}
                      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-200/60">
                        <div>
                          <h3 className="font-display font-black text-2xl text-slate-800 leading-tight mb-2">
                            {event?.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {event?.categories?.title && <CategoryBadge category={event.categories.title} />}
                            <ParticipationBadge type={event?.participation_type} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 text-xs text-slate-700 font-bold uppercase tracking-wider">
                          {event?.venue && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-[#E8A020] shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </span>
                          )}
                          {event?.event_date && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#F0A500] shrink-0" />
                              <span>{event.event_date}{event.start_time ? ` · ${event.start_time}` : ''}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Group join link */}
                      {event?.group_join_link && (
                        <a
                          href={event.group_join_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#E8A020] hover:text-[#ff1a53] transition-colors mb-2"
                        >
                          <ExternalLink size={12} /> Join WhatsApp / Telegram Group
                        </a>
                      )}

                      {/* Team info inside PinnedCard */}
                      {team && (
                        <div className="mt-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-200/60 flex items-center justify-center">
                                <Users size={18} className="text-slate-700" />
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-lg uppercase tracking-wide">{team.name}</p>
                                <p className="text-slate-600 text-xs font-bold mt-0.5">
                                  {isLeader ? '👑 You are the team leader' : `Led by ${team.users?.full_name}`}
                                </p>
                              </div>
                            </div>

                            {/* Join code in light board theme */}
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 flex items-center gap-2">
                                <span className="text-slate-600 text-xs font-bold">Code:</span>
                                <span className="font-display font-black text-slate-800 tracking-widest">{team.join_code}</span>
                                <button 
                                  onClick={() => copyCode(team.join_code)} 
                                  className="text-slate-400 hover:text-slate-600 transition-colors ml-1"
                                >
                                  {copiedCode === team.join_code ? (
                                    <Check size={13} className="text-green-600" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                              {isLeader && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-slate-200 hover:bg-slate-100 text-slate-700 font-bold"
                                  icon={team.is_open ? <Lock size={14} /> : <Unlock size={14} />}
                                  loading={isPending}
                                  onClick={() => toggleTeamOpen(team.id, team.is_open)}
                                  title={team.is_open ? 'Close team' : 'Open team'}
                                >
                                  {team.is_open ? 'Close' : 'Open'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Members */}
                          <div className="flex flex-wrap gap-2">
                            {team.team_members?.map((member: any) => (
                              <div 
                                key={member.user_id} 
                                className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 shadow-sm"
                              >
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 font-display">
                                  {member.users?.full_name?.[0]}
                                </div>
                                <span className="text-slate-700 text-xs font-medium">{member.users?.full_name}</span>
                                {member.user_id === team.leader_id && <Crown size={11} className="text-amber-500 fill-amber-500" />}
                                {isLeader && member.user_id !== userId && (
                                  <button
                                    onClick={() => removeMember(team.id, member.user_id, event.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                                    title="Remove member"
                                  >
                                    <UserMinus size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {!team.is_open && (
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
                              <Lock size={11} className="text-slate-400" /> Team is closed — not accepting new members
                            </p>
                          )}

                          {isLeader && (
                            <div className="mt-4 border-t border-slate-200 pt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                fullWidth 
                                className="border-slate-200 hover:bg-slate-100 text-slate-700 font-bold"
                                icon={showLeaderPanel === team.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                onClick={() => {
                                  if (showLeaderPanel === team.id) { setShowLeaderPanel(null) }
                                  else { setShowLeaderPanel(team.id); loadLeaderRequests(team.id) }
                                }}
                              >
                                Manage Join Requests
                              </Button>
                              {showLeaderPanel === team.id && (
                                <div className="mt-3 bg-slate-100/80 rounded-xl p-4 border border-slate-200">
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">
                                    Pending Join Requests
                                  </p>
                                  {loadingRequests ? (
                                    <p className="text-slate-500 text-sm">Loading...</p>
                                  ) : leaderRequests.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No pending requests</p>
                                  ) : (
                                    leaderRequests.map(req => (
                                      <div 
                                        key={req.id} 
                                        className="flex items-center justify-between p-3 rounded-lg bg-white mb-2 border border-slate-200 shadow-sm"
                                      >
                                        <div>
                                          <p className="text-slate-800 text-sm font-semibold">
                                            {(req.users as any)?.full_name}
                                          </p>
                                          <p className="text-slate-500 text-xs">
                                            {(req.users as any)?.email}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="success" 
                                            size="sm" 
                                            onClick={() => setRequestConfirm({ 
                                              id: req.id, 
                                              action: 'accepted', 
                                              name: (req.users as any)?.full_name || 'this user' 
                                            })}
                                          >
                                            Accept
                                          </Button>
                                          <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => setRequestConfirm({ 
                                              id: req.id, 
                                              action: 'rejected', 
                                              name: (req.users as any)?.full_name || 'this user' 
                                            })}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </PinnedCard>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Event Detail Modal ── */}
      <Modal open={!!selectedEvent} onClose={() => { setSelectedEvent(null); setTeamModal(null) }} size="lg" title={selectedEvent?.title}>
        {selectedEvent && (() => {
          const isRegistered = registeredIds.has(selectedEvent.id)
          const deadlinePassed = isDeadlinePassed(selectedEvent.deadline)
          const pendingRequest = requestStatusByEvent[selectedEvent.id]
          const catTitle = (Array.isArray(selectedEvent.categories) ? selectedEvent.categories[0] : selectedEvent.categories)?.title
          const colors = getCategoryColors(catTitle)

          return (
            <div className="flex flex-col gap-5">
              {/* Banner / stamp preview */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden" style={{ border: `2px solid ${colors.border}40` }}>
                {selectedEvent.banner_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-banners/${selectedEvent.banner_url}`} alt={selectedEvent.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 50%, ${colors.bg}, #0a0102)` }}>
                    <span className="text-8xl opacity-10">{catTitle === 'Sports' ? '🏆' : catTitle === 'Technical' || catTitle === 'Technicals' ? '💻' : '🎭'}</span>
                  </div>
                )}
                {/* Stamp-style overlay at top */}
                <div className="absolute top-0 left-0 right-0 px-4 py-2 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
                  {catTitle && (
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: colors.text }}>
                      {catTitle}
                    </span>
                  )}
                  <ParticipationBadge type={selectedEvent.participation_type} />
                </div>
              </div>

              {/* Event name */}
              <h2 className="font-display font-black uppercase" style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                letterSpacing: '0.08em',
                background: `linear-gradient(135deg, #fff, ${colors.text})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {selectedEvent.title}
              </h2>

              {/* Meta info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {selectedEvent.participation_type === 'team' && selectedEvent.team_size_max && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Users size={13} style={{ color: colors.text }} />
                    <span className="text-xs">Team: {selectedEvent.team_size_min}–{selectedEvent.team_size_max} members</span>
                  </div>
                )}
                {selectedEvent.venue && (
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin size={13} style={{ color: colors.text }} />
                    <span className="text-xs">{selectedEvent.venue}</span>
                  </div>
                )}
                {selectedEvent.event_date && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock size={13} style={{ color: colors.text }} />
                    <span className="text-xs">{selectedEvent.event_date}{selectedEvent.start_time ? ` · ${selectedEvent.start_time}` : ''}</span>
                  </div>
                )}
                {selectedEvent.organizer_name && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Phone size={13} style={{ color: colors.text }} />
                    <span className="text-xs">{selectedEvent.organizer_name}</span>
                  </div>
                )}
                {selectedEvent.deadline && (
                  <div className={`flex items-center gap-2 col-span-2 ${deadlinePassed ? 'text-red-400' : 'text-amber-400'}`}>
                    <AlertCircle size={13} />
                    <span className="text-xs">{deadlinePassed ? 'Registration Closed' : `Closes: ${formatIST(selectedEvent.deadline, 'PPp')}`}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
              )}

              {/* External links */}
              <div className="flex gap-3 flex-wrap">
                {selectedEvent.rulebook_url && (
                  <a href={selectedEvent.rulebook_url} target="_blank" rel="noreferrer"
                    className="nova-btn-outline text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                    <BookOpen size={14} /> Rulebook
                  </a>
                )}
                {selectedEvent.group_join_link && (
                  <a href={selectedEvent.group_join_link} target="_blank" rel="noreferrer"
                    className="nova-btn-accent text-sm px-4 py-2 rounded-lg flex items-center gap-2 text-white">
                    <ExternalLink size={14} /> Join WhatsApp Group
                  </a>
                )}
              </div>

              {actionError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">⚠ {actionError}</div>
              )}

              {/* CTA */}
              {isRegistered ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 p-4 rounded-xl font-semibold" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }}>
                    <Check size={18} /> Already Registered
                  </div>
                  <Button variant="ghost" size="sm" fullWidth className="text-red-400 hover:bg-red-500/10" icon={<LogOut size={14} />} loading={isPending} onClick={() => handleWithdrawClick(selectedEvent.id)}>
                    Withdraw from Event
                  </Button>
                </div>
              ) : deadlinePassed ? (
                <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">
                  <AlertCircle size={18} /> Registration Closed
                </div>
              ) : pendingRequest && pendingRequest.status === 'pending' ? (
                <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold">
                  <Bell size={18} /> Join Request Pending
                </div>
              ) : selectedEvent.participation_type === 'individual' ? (
                <Button variant="primary" size="lg" fullWidth loading={isPending} onClick={() => handleRegisterIndividual(selectedEvent.id)}>
                  Register for this Event
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-white/40 text-sm text-center">Team event — choose an option:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="primary" icon={<Plus size={16} />} onClick={() => setTeamModal('create')}>Create Team</Button>
                    <Button variant="outline" icon={<LogIn size={16} />} onClick={() => { setTeamModal('browse'); loadBrowseTeams(selectedEvent.id) }}>Join a Team</Button>
                  </div>
                  {teamModal === 'create' && (
                    <div className="glass rounded-xl p-4 border border-nova-primary/30 flex flex-col gap-3 animate-slide-up">
                      <Input label="Team Name" placeholder="Enter team name" value={teamName} onChange={e => setTeamName(e.target.value)} />
                      <Button variant="accent" loading={isPending} onClick={() => handleCreateTeam(selectedEvent.id)}>Create & Register</Button>
                    </div>
                  )}
                  {teamModal === 'browse' && (
                    <div className="glass rounded-xl p-4 border border-nova-primary/30 flex flex-col gap-3 animate-slide-up">
                      <Input label="Have a join code?" placeholder="6-char code e.g. A1B2C3" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
                      <Button variant="outline" loading={isPending} onClick={() => handleJoinByCode(selectedEvent.id)}>Join by Code</Button>
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-white/30 text-xs mb-3">Or request to join an open team:</p>
                        {loadingTeams ? <p className="text-white/30 text-sm text-center">Loading…</p> :
                          browseTeams.length === 0 ? <p className="text-white/30 text-sm text-center">No open teams yet.</p> :
                          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                            {browseTeams.map(team => {
                              const reqStatus = requestStatusByTeam[team.id]
                              const count = (team.team_members as any)?.[0]?.count || 0
                              const isFull = selectedEvent.team_size_max && count >= selectedEvent.team_size_max
                              return (
                                <div key={team.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                  <div>
                                    <p className="text-white text-sm font-medium">{team.name}</p>
                                    <p className="text-white/40 text-xs">Led by {(team.users as any)?.full_name} · {count} members{isFull ? ' · Full' : ''}</p>
                                  </div>
                                  {isFull ? <span className="text-xs text-white/30">Full</span> :
                                    reqStatus === 'pending' ? <span className="text-xs text-yellow-400 font-medium">Pending</span> :
                                    reqStatus === 'rejected' ? <span className="text-xs text-red-400 font-medium">Rejected</span> :
                                    <Button variant="outline" size="sm" loading={isPending} onClick={() => handleRequestJoin(team.id)}>Request</Button>
                                  }
                                </div>
                              )
                            })}
                          </div>
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })()}
      </Modal>

      {/* Withdraw Confirm Modal */}
      <Modal open={!!withdrawConfirm} onClose={() => setWithdrawConfirm(null)} size="sm" title="Withdraw from Event">
        {withdrawConfirm && (
          <div className="flex flex-col gap-4">
            {withdrawConfirm.wouldDissolve ? (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                ⚠ Leaving will dissolve your team as you are the last member. Your registration will be removed.
              </div>
            ) : (
              <p className="text-white/50 text-sm">Are you sure you want to withdraw? Your registration will be permanently deleted.</p>
            )}
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setWithdrawConfirm(null)}>Cancel</Button>
              <Button variant="danger" fullWidth loading={isPending} onClick={confirmWithdraw}>
                {withdrawConfirm.wouldDissolve ? 'Withdraw & Dissolve Team' : 'Withdraw'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Join Request Confirm Modal */}
      <Modal open={!!requestConfirm} onClose={() => setRequestConfirm(null)} size="sm" title={requestConfirm?.action === 'accepted' ? 'Accept Request' : 'Reject Request'}>
        {requestConfirm && (
          <div className="flex flex-col gap-4">
            <p className="text-white/50 text-sm">
              Are you sure you want to {requestConfirm.action} the request from <strong className="text-white">{requestConfirm.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setRequestConfirm(null)}>Cancel</Button>
              <Button variant={requestConfirm.action === 'accepted' ? 'success' : 'danger'} fullWidth loading={isPending} onClick={() => handleRespondRequest(requestConfirm.id, requestConfirm.action)}>
                Yes, {requestConfirm.action === 'accepted' ? 'Accept' : 'Reject'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
