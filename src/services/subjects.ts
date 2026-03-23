import { supabase } from '../lib/supabase'


export async function getAllSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      domains(name),
      subject_professors(
        professors(id, name)
      )
    `)
  if (error) throw error
  return data
}


export async function getSubjectById(id: string) {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      domains(name),
      subject_professors(
        professors(id, name)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Récupérer les matières par domaine
export async function getSubjectsByDomain(domainId: string) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('domain_id', domainId)
  if (error) throw error
  return data
}


export async function getSubjectsByYear(year: string) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('year', year)
  if (error) throw error
  return data
}


export async function updateAverageRating(subjectId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('user_rating')
    .eq('subject_id', subjectId)
  if (error) throw error

  const ratings = data.map(r => r.user_rating).filter(Boolean)
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length

  await supabase
    .from('subjects')
    .update({ average_user_rating: average })
    .eq('id', subjectId)
}