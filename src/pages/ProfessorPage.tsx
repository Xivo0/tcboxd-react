import './ProfessorPage.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  getProfessorById,
  getProfessorLikeCount,
  isProfessorLikedByUser,
  toggleProfessorLike,
} from '../services/professors';

export default function ProfessorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!id) return;

      const [prof, count] = await Promise.all([
        getProfessorById(id),
        getProfessorLikeCount(id),
      ]);
      setProfessor(prof);
      setLikeCount(count);

      if (user) {
        const likedByUser = await isProfessorLikedByUser(id, user.id);
        setLiked(likedByUser);
      }
    } catch (err) {
      console.error('Erreur chargement professeur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleToggleLike = async () => {
    if (!user || !id) return alert('Connecte-toi pour liker ce professeur.');
    setSubmitting(true);

    try {
      const newLiked = await toggleProfessorLike(id, user.id);
      const count = await getProfessorLikeCount(id);
      setLiked(newLiked);
      setLikeCount(count);
    } catch (err: any) {
      alert('Erreur : ' + (err.message ?? err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!professor) return <p>Professeur introuvable</p>;

  return (
    <div className="prof-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <section className="prof-header">
        <h1>{professor.name}</h1>
        {professor.title && <p className="prof-title">{professor.title}</p>}
        <div className="prof-meta">
          <span className="prof-likes"> {likeCount} like{likeCount > 1 ? 's' : ''}</span>
          <button className="like-button" onClick={handleToggleLike} disabled={submitting}>
            {liked ? 'Retirer des favoris' : 'Mettre en favoris'}
          </button>
        </div>
      </section>

      <section className="prof-details">
        <h2 >Matières enseignées</h2>
        {professor.subject_professors?.length > 0 ? (
          <ul text-color="#000000">
            {professor.subject_professors.map((sp: any) => (
              <li key={sp.subjects.id}>{sp.subjects.name}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune matière liée pour le moment.</p>
        )}
      </section>

      <section className="prof-description">
        <h2>À propos</h2>
        <p>{professor.description ?? 'Pas de description disponible.'}</p>
      </section>
    </div>
  );
}
