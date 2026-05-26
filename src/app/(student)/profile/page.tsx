import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QRDisplay } from '@/components/ui/QRDisplay'
import { PaymentBadge, EntryBadge } from '@/components/ui/Badge'
import { User, Mail, Phone, MapPin, GraduationCap, Globe } from 'lucide-react'
import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { PinnedCard } from '@/components/ui/PinnedCard'

export const metadata: Metadata = { title: 'Profile | Nova Unplugged 2026' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('*, user_types(name), user_roles(name, permissions_level)')
    .eq('id', user.id)
    .single()

  const fields = [
    { label: 'Full Name', value: userData?.full_name, icon: User },
    { label: 'Email', value: userData?.email, icon: Mail },
    { label: 'Phone', value: userData?.phone, icon: Phone },
    { label: 'Pincode', value: userData?.pincode, icon: MapPin },
    { label: 'City', value: userData?.city, icon: MapPin },
    { label: 'State', value: userData?.state, icon: MapPin },
    { label: 'Batch', value: userData?.batch, icon: GraduationCap },
    { label: 'Zone', value: userData?.zone, icon: Globe },
  ].filter(f => f.value)

  return (
    <PageWrapper
      title="Your"
      titleHighlight="Profile"
      subtitle="Your registration details and gate pass QR code"
      maxWidth="md"
    >
      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Profile info */}
        <PinnedCard pinColor="blue" title="Profile Details">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-[#2980B9]/15 border border-[#2980B9]/30 flex items-center justify-center text-2xl font-bold font-display text-[#2980B9]">
              {userData?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white leading-tight">{userData?.full_name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <PaymentBadge status={userData?.payment_status || 'pending'} />
                <EntryBadge status={userData?.entry_status || 'not_approved'} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2980B9]/10 flex items-center justify-center shrink-0 border border-[#2980B9]/20">
                  <Icon size={14} className="text-[#2980B9]" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-white/90 text-sm font-bold mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>


        </PinnedCard>

        {/* QR Code */}
        <PinnedCard pinColor="pink" title="Gate Pass QR">
          {userData?.payment_status === 'approved' && userData?.entry_code ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-white/50 text-xs mb-6 text-center max-w-[240px]">
                Show this at the gate for entry. Your code is unique and single-use.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex justify-center mb-6">
                <QRDisplay
                  value={userData.entry_code}
                  size={200}
                  label={`Nova Unplugged 2026 · ${userData.full_name}`}
                  downloadName={`nova-qr-${userData.full_name?.toLowerCase().replace(/\s/g, '-')}`}
                />
              </div>
              <div className="w-full p-3 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 text-center shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                <p className="text-[#00FF88] text-xs font-bold uppercase tracking-wider">✓ Entry Approved · Keep safe</p>
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-center h-full py-8">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl opacity-50">🔒</span>
              </div>
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-white mb-2">QR Not Available Yet</h3>
              <p className="text-white/50 text-xs max-w-[200px] leading-relaxed">
                {userData?.payment_status === 'pending'
                  ? 'Your payment is under review. QR will be generated once approved.'
                  : userData?.payment_status === 'rejected'
                    ? 'Your payment was rejected. Please resubmit on the payment page.'
                    : 'Complete payment to get your gate pass QR code.'}
              </p>
            </div>
          )}
        </PinnedCard>
      </div>
    </PageWrapper>
  )
}
