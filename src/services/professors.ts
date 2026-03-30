import { supabase } from '../lib/supabase'
import { addFavoriteProfessor, removeFavoriteProfessor } from './users'

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
  const { data, error } = await supabase
    .from('professors')
    .select('favorites_count')
    .eq('id', professorId)
    .single()
  if (error) throw error
  return data?.favorites_count ?? 0
}

export async function isProfessorLikedByUser(professorId: string, userId: string) {
  const { data, error } = await supabase
    .from('user_favorite_professors')
    .select('user_id, professor_id')
    .eq('professor_id', professorId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function toggleProfessorLike(professorId: string, userId: string) {
  const isLiked = await isProfessorLikedByUser(professorId, userId)

  if (isLiked) {
    await removeFavoriteProfessor(userId, professorId)
    return false
  } else {
    await addFavoriteProfessor(userId, professorId)
    return true
  }
}