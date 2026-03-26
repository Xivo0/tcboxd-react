import './ListeMatieres.css';
import { useEffect, useState } from 'react';
import { getAllProfessors } from '../services/professors';
import { useNavigate } from 'react-router-dom';

export default function ListesProfs() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();


  useEffect(() => {
    getAllProfessors()
      .then(data => {
        setProfessors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      })
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="liste-profs-section">
      <h1>Tous les professeurs</h1>
      <div className="profs-grid">
        {professors.map((professor) => (
          <div key={professor.id} className="prof-card">
            <h3>{professor.name}</h3>
            {professor.subject_professors && (
              <p className="prof-subjects">
                {professor.subject_professors.map((sp: any) => sp.subjects.name).join(', ')}
              </p>
            )}
            <button className="rate-button" onClick={() => navigate(`/professors/${professor.id}`)}>
              Plus d'infos
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}