import { supabase } from '../lib/supabase'

// Récupérer tous les profs avec leurs matières
export async function getAllProfessors() {
  const { data, error } = await supabase
    .from('professors')
    .select(`
      *,
      subject_professors(
        subjects(id, name)
      )
    `)
  if (error) throw error
  return data
}

// Récupérer un prof par son id
export async function getProfessorById(id: string) {
  const { data, error } = await supabase
    .from('professors')
    .select(`
      *,
      subject_professors(
        subjects(id, name)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getProfessorLikeCount(professorId: string) {
  const { count, error } = await supabase
    .from('user_favorite_professors')
    .select('*', { count: 'exact', head: true })
    .eq('professor_id', professorId)
  if (error) throw error
  return count ?? 0
}

export async function isProfessorLikedByUser(professorId: string, userId: string) {
  const { data, error } = await supabase
    .from('user_favorite_professors')
    .select('id')
    .eq('professor_id', professorId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function toggleProfessorLike(professorId: string, userId: string) {
  const { data, error } = await supabase
    .from('user_favorite_professors')
    .select('id')
    .eq('professor_id', professorId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error

  if (data) {
    const { error: deleteError } = await supabase
      .from('user_favorite_professors')
      .delete()
      .eq('id', data.id)
    if (deleteError) throw deleteError
    return false
  }

  const { error: insertError } = await supabase
    .from('user_favorite_professors')
    .insert([{ user_id: userId, professor_id: professorId }])
  if (insertError) throw insertError
  return true
}