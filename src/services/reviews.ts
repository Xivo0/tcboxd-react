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

export async function getTopRaters() {
  const { data, error } = await supabase
    .from('users')
    .select('username, grades_mean')
    .not('grades_mean', 'is', null)
    .order('grades_mean', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}
// Classement haters (pires notes)
export async function getTopHaters() {
  const { data, error } = await supabase
    .from('users')
    .select('username, grades_mean')
    .not('grades_mean', 'is', null)
    .order('grades_mean', { ascending: true })
    .limit(10)
  if (error) throw error
  return data
}

  // Récupérer les stats de notation par utilisateur (moyenne et nombre d'avis)
  export async function getUserRatingStats() {
    // Récupère toutes les reviews avec info utilisateur
    const { data, error } = await supabase
      .from('reviews')
      .select(`user_id, user_rating, users(username)`)
    if (error) throw error

    const stats: Record<string, { user_id: string; username?: string; count: number; avg: number }> = {}
    if (Array.isArray(data)) {
      data.forEach((r: any) => {
        const id = r.user_id || 'unknown'
        if (!stats[id]) stats[id] = { user_id: id, username: r.users?.username, count: 0, avg: 0 }
        // accumulate sum in avg temporarily
        stats[id].avg += (typeof r.user_rating === 'number' ? r.user_rating : 0)
        stats[id].count += 1
      })
      // convert sum to average
      Object.values(stats).forEach(s => {
        s.avg = s.count > 0 ? +(s.avg / s.count).toFixed(2) : 0
      })
    }

    // return array sorted by avg desc (highest raters first)
    const arr = Object.values(stats).sort((a, b) => b.avg - a.avg)
    return arr
  }

// Récupérer les avis récents (toutes matières)
export async function getRecentReviews(limit = 10) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users(username)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}