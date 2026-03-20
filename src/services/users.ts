import { supabase } from '../lib/supabase'

// Récupérer le profil d'un user
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      reviews(subject_id, user_rating, comment),
      user_favorite_subjects(subjects(id, name)),
      user_favorite_professors(professors(id, name))
    `)
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// Créer un user à l'inscription
export async function createUser(username: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, email }])
  if (error) throw error
  return data
}

// Ajouter une matière en favori
export async function addFavoriteSubject(userId: string, subjectId: string) {
  const { error } = await supabase
    .from('user_favorite_subjects')
    .insert([{ user_id: userId, subject_id: subjectId }])
  if (error) throw error
}

// Retirer une matière des favoris
export async function removeFavoriteSubject(userId: string, subjectId: string) {
  const { error } = await supabase
    .from('user_favorite_subjects')
    .delete()
    .eq('user_id', userId)
    .eq('subject_id', subjectId)
  if (error) throw error
}

// Ajouter un prof en favori
export async function addFavoriteProfessor(userId: string, professorId: string) {
  const { error } = await supabase
    .from('user_favorite_professors')
    .insert([{ user_id: userId, professor_id: professorId }])
  if (error) throw error
}

// Retirer un prof des favoris
export async function removeFavoriteProfessor(userId: string, professorId: string) {
  const { error } = await supabase
    .from('user_favorite_professors')
    .delete()
    .eq('user_id', userId)
    .eq('professor_id', professorId)
  if (error) throw error
}