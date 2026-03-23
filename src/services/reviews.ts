import { supabase } from '../lib/supabase'

// Récupérer tous les avis d'une matière
export async function getReviewsBySubject(subjectId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users(username)
    `)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Ajouter un avis
export async function addReview(
  userId: string,
  subjectId: string,
  userRating: number,
  dsGrade: number,
  comment: string,
  isRageDetected: boolean,
  rageScore: number
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      user_id: userId,
      subject_id: subjectId,
      user_rating: userRating,
      ds_grade: dsGrade,
      comment,
      is_rage_detected: isRageDetected,
      rage_score: rageScore
    }])
  if (error) throw error
  return data
}

// Classement suceurs (meilleures notes)
export async function getTopRaters() {
  const { data, error } = await supabase
    .from('reviews')
    .select('users(username), user_rating')
    .order('user_rating', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}

// Classement haters (pires notes)
export async function getTopHaters() {
  const { data, error } = await supabase
    .from('reviews')
    .select('users(username), user_rating')
    .order('user_rating', { ascending: true })
    .limit(10)
  if (error) throw error
  return data
}