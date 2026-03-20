import './SubjectsToRate.css';
import { useEffect, useState } from 'react';
// ↑ on ajoute les hooks React

import { getAllSubjects } from './services/subjects';
// ↑ on importe la fonction qui parle à Supabase

export default function SubjectsToRate() {

  const [subjects, setSubjects] = useState<any[]>([]);
  // ↑ remplace 'data.courses' — tableau vide au départ

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllSubjects()
    // ↑ appelle la table 'subjects' dans Supabase
    
      .then(data => {
        setSubjects(data);
        // ↑ remplit le state avec les vraies données
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement matières:', err);
        setLoading(false);
      })
  }, []);
  // ↑ [] = une seule fois au chargement

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="subjects-section">
      <h2 className="section-title">Matières à noter</h2>
      
      <div className="subjects-grid">
        {subjects.map((subject) => (
        // ↑ 'subject' = une ligne de la table subjects dans Supabase
        
          <div key={subject.id} className="subject-card">
          // ↑ subject.id = UUID de la table subjects
          
            <h3>{subject.name}</h3>
            // ↑ subject.name = colonne 'name' de la table subjects
            
            <span className="subject-code">{subject.year}</span>
            // ↑ subject.year = colonne 'year' ('3TC', '4TC', '5TC')
            // remplace courses.credits qui n'existe plus dans votre table
            
            <button className="rate-button">Noter</button>
          </div>
        ))}
      </div>
    </section>
  );
}