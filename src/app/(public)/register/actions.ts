'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function checkAllowedEmail(email: string): Promise<boolean> {
  const supabaseAdmin = await createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('allowed_emails')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (error) {
    console.error('Error checking allowed emails:', error)
    return false
  }

  return !!data
}

export async function approveUserPaymentStatus(userId: string): Promise<boolean> {
  const supabaseAdmin = await createAdminClient()
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({ payment_status: 'approved' })
    .eq('id', userId)

  if (error) {
    console.error('Error approving user payment status:', error)
    return false
  }

  return true
}
