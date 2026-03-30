import './SubjectsToRate.css';
import { useEffect, useState } from 'react';
import { getAllSubjects } from '../services/subjects';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function SubjectsToRate() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        // Récupère l'utilisateur courant
        const { data: { user } } = await supabase.auth.getUser();

        const userReviewsPromise = user ? supabase.from('reviews').select('subject_id').eq('user_id', user.id) : Promise.resolve({ data: [] })
        const allSubjects = await getAllSubjects()
        const userReviews = await userReviewsPromise

        if(!mounted) return

        const reviewedIds = new Set((userReviews as any).data?.map((r: any) => r.subject_id) || [])
        // Filter subjects the user hasn't reviewed yet
        const remaining = (allSubjects || []).filter((s: any) => !reviewedIds.has(s.id))

        // Si l'utilisateur a tout noté ou que la liste est vide, on affiche un fallback (les premières matières)
        const toShow = remaining.length > 0 ? remaining.slice(0,4) : (allSubjects || []).slice(0,4)
        setSubjects(toShow)
      } catch (err) {
        console.error('Erreur chargement matières:', err);
      } finally {
        if(mounted) setLoading(false)
      }
    }

    load()
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