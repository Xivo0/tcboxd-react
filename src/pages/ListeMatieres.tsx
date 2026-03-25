import './ListeMatieres.css';
import { useEffect, useState } from 'react';
import { getAllSubjects } from '../services/subjects';

export default function ListeMatieres() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    getAllSubjects()
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      })
  }, []);

  const filteredSubjects = subjects
    .filter(s => selectedYear === 'all' || s.year === selectedYear);

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="liste-matieres-section">
      <h1>Toutes les matières</h1>

      <div className="filtres">
        <select onChange={e => setSelectedYear(e.target.value)} value={selectedYear}>
          <option value="all">Toutes les années</option>
          <option value="3TC">3TC</option>
          <option value="4TC">4TC</option>
          <option value="5TC">5TC</option>
        </select>
      </div>

      <div className="matieres-grid">
        {filteredSubjects.map(subject => (
          <div key={subject.id} className="matiere-card">
            <h3>{subject.name}</h3>
            <span>{subject.year}</span>
            <span>{subject.domains?.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}