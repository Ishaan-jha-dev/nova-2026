import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const supabaseAdmin = await createAdminClient()

  // Kick out users whose email is no longer in the allowed_emails list
  const { data: allowedUser } = await supabaseAdmin
    .from('allowed_emails')
    .select('id')
    .eq('email', user.email?.toLowerCase().trim() || '')
    .maybeSingle()

  if (!allowedUser) {
    // If not allowed, redirect to login page (we can pass a query param if desired, or just redirect)
    redirect('/login?error=not_allowed')
  }

  return (
    <div className="min-h-screen flex bg-nova-bg">
      <main className="flex-1 pt-0 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
