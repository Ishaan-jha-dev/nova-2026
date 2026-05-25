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
  
  // Wait a brief moment to ensure the database trigger `trg_new_user` has fully committed
  // the row into public.users before we attempt to update it.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate an 8-character alphanumeric entry code as a bulletproof fallback
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let entryCode = ''
  for (let i = 0; i < 8; i++) {
    entryCode += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({ 
      payment_status: 'approved',
      entry_status: 'approved',
      entry_code: entryCode
    })
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
