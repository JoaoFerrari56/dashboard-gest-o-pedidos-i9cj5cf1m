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

  try {
    // Check if establishment already exists for this user to avoid upsert conflicts
    const { data: existing, error: existingError } = await supabase
      .from('establishments')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle()

    if (existingError) {
      return { data: null, error: existingError }
    }

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('establishments')
        .update({
          ...payload,
          operating_hours: '', // Legacy field compatibility
        })
        .eq('id', existing.id)
        .select()
        .single()

      return { data, error }
    } else {
      // Insert new record, explicitly passing the authenticated user's ID
      const { data, error } = await supabase
        .from('establishments')
        .insert({
          ...payload,
          user_id,
          operating_hours: '',
        })
        .select()
        .single()

      return { data, error }
    }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
