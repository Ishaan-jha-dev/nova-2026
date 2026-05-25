import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Kick out users whose email is no longer in the allowed_emails list
  const { data: allowedUser, error } = await supabase
    .from('allowed_emails')
    .select('id')
    .eq('email', user.email?.toLowerCase().trim() || '')
    .maybeSingle()

  if (!allowedUser) {
    // If not allowed, redirect to login page (we can pass a query param if desired, or just redirect)
    const debugInfo = error ? error.message : `not_found_${user.email}`
    redirect(`/login?error=not_allowed&details=${encodeURIComponent(debugInfo)}`)
  }

  return (
    <div className="min-h-screen flex bg-nova-bg">
      <main className="flex-1 pt-0 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
