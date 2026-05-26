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

export async function fetchPincodeInfo(pincode: string) {
  try {
    const res = await fetch(`https://api.zippopotam.us/IN/${pincode}`, {
      cache: 'force-cache'
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data.places && data.places.length > 0) {
        const place = data.places[0]
        return { success: true, city: place['place name'], state: place['state'] }
      }
    }
    return { success: false }
  } catch (err) {
    console.error('Error fetching pincode via server:', err)
    return { success: false }
  }
}
