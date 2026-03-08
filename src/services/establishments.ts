import { supabase } from '@/lib/supabase/client'

export async function getEstablishment() {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching establishment:', error)
  }

  return { data, error }
}

export async function createEstablishment(payload: {
  name: string
  category: string
  operating_hours: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('establishments')
    .insert({
      ...payload,
      user_id: user.id,
    })
    .select()
    .single()

  return { data, error }
}
