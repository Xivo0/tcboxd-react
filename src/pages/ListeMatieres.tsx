import './ListeMatieres.css';
import { useEffect, useState } from 'react';
import { getAllSubjects } from '../services/subjects';
import { useNavigate } from 'react-router-dom';

export default function ListeMatieres() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const navigate = useNavigate();

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

  // Fonction pour transformer les noms de catégories en classes CSS valides
  const formatClassName = (name: string) => {
    if (!name) return 'card-default';
    return 'card-' + name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/\s+/g, '-'); // Remplace les espaces par des tirets
  };

  const filteredSubjects = subjects
    .filter(s => selectedYear === 'all' || s.year === selectedYear);

  if (loading) return <div className="loading-state">Chargement...</div>;

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
        {filteredSubjects.map(subject => {
          const domainClass = formatClassName(subject.domains?.name);

          return (
            /* On concatène toujours la classe de base ET la classe spécifique */
            <div key={subject.id} className={`matiere-card ${domainClass}`}>
              <div className="card-content">
                <div className="card-header">
                   <span className="year-badge">{subject.year}</span>
                   <h3>{subject.name}</h3>
                </div>
                
                <div className="card-footer">
                  <span className="domain-label">{subject.domains?.name}</span>
                  <button 
                    className="rate-button" 
                    onClick={() => navigate(`/subjects/${subject.id}`)}
                  >
                    Noter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}