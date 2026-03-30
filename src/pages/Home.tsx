import { useEffect, useState } from 'react'
import { getAllSubjects } from '../services/subjects'
import { getTopRaters, getTopHaters } from '../services/reviews'
import './Home.css'

function Home() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [topRaters, setTopRaters] = useState<any[]>([])
  const [topHaters, setTopHaters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On lance les 3 appels Supabase en parallèle
    Promise.all([
      getAllSubjects(),
      getTopRaters(),
      getTopHaters()
    ]).then(([subjectsData, ratersData, hatersData]) => {
      setSubjects(subjectsData)
      setTopRaters(ratersData)
      setTopHaters(hatersData)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div>

      {/* Matières à noter */}
      <section>
        <h2 className="section-title-white">Matières à noter</h2>
        <div className="subjects-scroll">
          {subjects.map(subject => (
            <a key={subject.id} href={`/subjects/${subject.id}`}>
              <div className="subject-card">
                <p>{subject.name}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Aperçu classements */}
      <section>
        <h2 className="section-title-white">Aperçu classements</h2>
        <div className="rankings-preview">

          <div>
            <h3>🏆 Suceurs</h3>
            {topRaters.slice(0, 3).map((r, i) => (
              <p key={i}>{r.users?.username} — {r.user_rating}/10</p>
            ))}
          </div>

          <div>
            <h3>😤 Haters</h3>
            {topHaters.slice(0, 3).map((r, i) => (
              <p key={i}>{r.users?.username} — {r.user_rating}/10</p>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}

export default Home