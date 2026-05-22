import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentSidebar } from '@/components/layout/StudentSidebar'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: _ud } = await supabase
    .from('users')
    .select('full_name, email, payment_status')
    .eq('id', user.id)
    .single()
  const userData = _ud as { full_name: string; email: string; payment_status: string } | null

  const initials = (userData?.full_name || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen flex bg-nova-bg">
      <StudentSidebar
        userName={userData?.full_name || 'Student'}
        userEmail={userData?.email || ''}
        initials={initials}
      />
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 overflow-y-auto">
        {children}
      </main>
      <WhatsAppButton />
    </div>
  )
}
