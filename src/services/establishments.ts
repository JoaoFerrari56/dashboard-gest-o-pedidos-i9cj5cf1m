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

export async function uploadLogo(file: File) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(fileName, file)

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
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('establishments')
    .insert({
      ...payload,
      user_id: user.id,
      operating_hours: '',
    } as any)
    .select()
    .single()

  return { data, error }
}
