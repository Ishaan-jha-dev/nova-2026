import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { RegistrationsClient } from './RegistrationsClient'

export const metadata: Metadata = { title: 'Registrations | Admin' }

const EVENT_PAGE_SIZE = 5

export default async function RegistrationsPage(props: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase.from('users').select('user_roles(permissions_level)').eq('id', user.id).single()
  const roleLevel = (userData?.user_roles as any)?.permissions_level ?? 1
  if (roleLevel < 3) redirect('/admin')

  const admin = await createAdminClient()

  const selectedCategory = searchParams.category || 'all'
  const page = parseInt(searchParams.page || '1', 10)
  const from = (page - 1) * EVENT_PAGE_SIZE
  const to = from + EVENT_PAGE_SIZE - 1

  // 1. Fetch all active categories for the filter tabs
  const { data: categories } = await admin.from('categories').select('*').order('title')

  // 2. Stats — total unique students (deduped, avoids double count)
  const { count: totalUnique } = await admin
    .from('registrations')
    .select('user_id', { count: 'exact', head: true })
  // Note: Supabase doesn't natively support COUNT(DISTINCT) in the client SDK's select().
  // We fetch unique user_ids via a workaround query below.
  const { data: uniqueUserRows } = await admin
    .from('registrations')
    .select('user_id')
  const uniqueStudentCount = new Set((uniqueUserRows || []).map((r: any) => r.user_id)).size

  // 3. Per-event registration counts
  const { data: allRegCounts } = await admin.from('registrations').select('event_id')
  const perEventCount: Record<string, number> = {}
  for (const r of allRegCounts || []) {
    perEventCount[r.event_id] = (perEventCount[r.event_id] || 0) + 1
  }

  // 4. Get total registrations count for stats
  let totalCountQuery = admin
    .from('registrations')
    .select('id, events!inner(category_id)', { count: 'exact', head: true })
  
  if (selectedCategory !== 'all') {
    totalCountQuery = totalCountQuery.eq('events.category_id', selectedCategory)
  }
  const { count: totalCount } = await totalCountQuery

  // 5. Paginated events, filtered by category
  let eventQuery = admin
    .from('events')
    .select('id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (selectedCategory !== 'all') {
    eventQuery = eventQuery.eq('category_id', selectedCategory)
  }

  const { data: eventsPage, count: totalEventsCount } = await eventQuery
  const eventIds = (eventsPage || []).map(e => e.id)

  // 6. Fetch ALL registrations for these events so teams are never split
  let registrations: any[] = []
  if (eventIds.length > 0) {
    const { data: regs } = await admin
      .from('registrations')
      .select(`
        *,
        users(full_name, email),
        events!inner(id, title, category_id, participation_type, is_submission_based, categories(id, title)),
        teams(name, join_code, leader_id)
      `)
      .in('event_id', eventIds)
      .order('created_at', { ascending: false })
    
    registrations = regs || []
  }

  const totalPages = Math.ceil((totalEventsCount || 0) / EVENT_PAGE_SIZE)

  return (
    <RegistrationsClient
      registrations={registrations || []}
      categories={categories || []}
      selectedCategory={selectedCategory}
      page={page}
      totalPages={totalPages}
      totalCount={totalCount || 0}
      uniqueStudentCount={uniqueStudentCount}
      perEventCount={perEventCount}
      adminRoleLevel={roleLevel}
    />
  )
}
