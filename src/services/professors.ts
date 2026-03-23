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

// Mettre à jour le nombre de favoris d'un prof
export async function updateProfessorFavorites(professorId: string) {
  const { count, error } = await supabase
    .from('user_favorite_professors')
    .select('*', { count: 'exact' })
    .eq('professor_id', professorId)
  if (error) throw error

  await supabase
    .from('professors')
    .update({ favorites_count: count })
    .eq('id', professorId)
}