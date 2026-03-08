import { supabase } from '@/lib/supabase/client'

export async function getEstablishment() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching establishment:', error)
  }

  return { data, error }
}

export async function uploadLogo(file: File) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Not authenticated')

  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(fileName, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from('logos')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

export async function createEstablishment(payload: {
  name: string
  category: string
  schedule: any
  logo_url?: string
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return {
      data: null,
      error: new Error(
        'Erro de autenticação: Usuário não logado. Por favor, faça login novamente.',
      ),
    }
  }

  const user_id = session.user.id
  const email = session.user.email || ''

  try {
    // 1. Proactive User Sync using Upsert
    // Guarantees the user exists in public.users to prevent FK violations (23503).
    // Upsert avoids race conditions and 409 Conflict errors that occur with check-then-insert.
    const { error: syncError } = await supabase
      .from('users')
      .upsert({ id: user_id, email }, { onConflict: 'id' })

    if (syncError) {
      console.warn('Sync user warning:', syncError)
    }

    // 2. Atomic Registration of Establishment
    // Using upsert on the unique user_id ensures we either create or update cleanly,
    // solving database conflicts while complying perfectly with the RLS policies.
    const { data, error } = await supabase
      .from('establishments')
      .upsert(
        {
          ...payload,
          user_id,
          operating_hours: '', // Legacy field compatibility
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (err: any) {
    console.error('Establishment creation failed:', err)
    return { data: null, error: err }
  }
}
