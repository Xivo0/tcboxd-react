import { useEffect, useState } from 'react'
import { getAllSubjects, getSubjectsByDomain, getSubjectsByYear } from '../services/subjects'

function SubjectsList() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // États des filtres
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')

  useEffect(() => {
    getAllSubjects().then(data => {
      setSubjects(data)
      setLoading(false)
    })
  }, [])

  // Applique les filtres localement sans rappeler Supabase
  const filteredSubjects = subjects
    .filter(s => selectedDomain === 'all' || s.domain_id === selectedDomain)
    .filter(s => selectedYear === 'all' || s.year === selectedYear)

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      <h1>Toutes les matières</h1>

      {/* Filtres */}
      <div className="filters">

        <select onChange={e => setSelectedDomain(e.target.value)} value={selectedDomain}>
          <option value="all">Tous les domaines</option>
          <option value="Informatique">Informatique</option>
          <option value="Sysco">Sysco</option>
          <option value="Réseau">Réseau</option>
          <option value="Humanités">Humanités</option>
        </select>

        <select onChange={e => setSelectedYear(e.target.value)} value={selectedYear}>
          <option value="all">Toutes les années</option>
          <option value="3TC">3TC</option>
          <option value="4TC">4TC</option>
          <option value="5TC">5TC</option>
        </select>

      </div>

      {/* Liste des matières filtrées */}
      <div className="subjects-grid">
        {filteredSubjects.map(subject => (
          <a key={subject.id} href={`/subjects/${subject.id}`}>
            <div className="subject-card">
              <h2>{subject.name}</h2>
              <p>{subject.domains?.name}</p>
              <p>{subject.year}</p>
              <p>{subject.average_user_rating}/10</p>
            </div>
          </a>
        ))}
      </div>

    </div>
  )
}

export default SubjectsList