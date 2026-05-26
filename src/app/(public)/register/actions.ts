'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function checkAllowedEmail(email: string): Promise<{ allowed: boolean, gmail?: string }> {
  const supabaseAdmin = await createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('allowed_emails')
    .select('id, gmail')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (error) {
    console.error('Error checking allowed emails:', error)
    return { allowed: false }
  }

  return { allowed: !!data, gmail: data?.gmail || undefined }
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

export async function checkIfUserExists(email: string): Promise<boolean> {
  const supabaseAdmin = await createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (error) {
    console.error('Error checking if user exists:', error)
    return false
  }

  return !!data
}
