import './SubjectsToRate.css';
import { useEffect, useState } from 'react';
import { getAllSubjects } from '../services/subjects';
import { useNavigate } from 'react-router-dom';

export default function SubjectsToRate() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    getAllSubjects()
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement matières:', err);
        setLoading(false);
      })
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="subjects-section">
      <h2 className="section-title">Matières à noter</h2>
      <div className="subjects-grid">
        {subjects.slice(0, 4).map((subject) => (
          <div key={subject.id} className="subject-card">
            <h3>{subject.name}</h3>
            <span className="subject-code">{subject.year}</span>
          	{/* Un petit bouton factice pour inviter au clic */}
            <button className="rate-button" onClick={() => navigate(`/subjects/${subject.id}`)}>Noter</button>
          </div>
        ))}
      </div>
    </section>
  );
}