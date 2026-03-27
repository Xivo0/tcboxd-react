import './Matieres.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../services/subjects';
import { getReviewsBySubject } from '../services/reviews';
import { supabase } from '../lib/supabase';

// Fonction outil hors du composant
const deleteReview = async (reviewId: string) => {
  return await supabase.from('reviews').delete().eq('id', reviewId);
};

export default function Matieres() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  const [rating, setRating] = useState<number>(5);
  const [dsGrade, setDsGrade] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 1. ON SORT LA FONCTION POUR POUVOIR LA RAPPELER APRÈS SUPPRESSION
  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const [subjectData, reviewsData] = await Promise.all([
        getSubjectById(id!),
        getReviewsBySubject(id!)
      ]);
      setSubject(subjectData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return alert("Connecte-toi avec GitHub !");
    
    setSubmitting(true);
    try {
      await addReview(username, id, rating, dsGrade, comment, false, 0.0);
      const updatedReviews = await getReviewsBySubject(id);
      setReviews(updatedReviews);
      setUsername('');
      setRating(5);
      setDsGrade(0);
      const { error } = await supabase.from('reviews').insert([{ 
        user_id: user.id, 
        subject_id: id, 
        user_rating: rating,
        ds_grade: dsGrade,
        comment: comment 
      }]);
      if (error) throw error;

      await loadData(); // Rafraîchit la liste
      setComment('');
      alert("Avis posté !");
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionDelete = async (reviewId: string) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    const { error } = await deleteReview(reviewId);
    if (error) alert(error.message);
    else await loadData(); // Ici ça fonctionne car loadData est accessible
  };

  if (loading) return <p>Chargement...</p>;
  if (!subject) return <p>Matière introuvable</p>;

  const averageDsGrade = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.ds_grade, 0) / reviews.length).toFixed(2) : 'N/A';
  const averageUserRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.user_rating, 0) / reviews.length).toFixed(2) : 'N/A';

  return (
    <div className="matiere-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>

      <section className="matiere-header">
        <h1>{subject.name}</h1>
        <p><strong>Note moyenne :</strong> {averageUserRating}/10</p>
        <p><strong>Note moyenne DS :</strong> {averageDsGrade}/20</p>
      </section>

      <section className="matiere-form">
        <h2>Poster un avis</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Votre pseudo"
              required
            />
          </div>
          <div className="form-group">
            <label>Note (/5)</label>
            <input
              type="number"
              min={0}
              max={5}
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label>Note DS(/20)</label>
            <input
              type="number"
              value={dsGrade}
              onChange={e => setDsGrade(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label>Commentaire</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Votre avis sur cette matière..."
              rows={4}
              required
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Poster mon avis'}
          </button>
        </form>
      </section>

      <section className="matiere-reviews">
        <h2>Avis ({reviews.length})</h2>
        {reviews.length === 0 && <p>Aucun avis pour l'instant — soyez le premier !</p>}
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <strong>{review.users?.username ?? 'Anonyme'}</strong>
              <span className="review-rating">{review.user_rating}/10</span>
        {user ? (
          <form onSubmit={handleSubmit}>
            <p>Posté en tant que : <strong>{user.user_metadata.full_name || user.email}</strong></p>
            <div className="form-group">
              <label>Note (0-10) :</label>
              <input type="number" min={0} max={10} value={rating} onChange={e => setRating(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Note DS (0-20) :</label>
              <input type="number" min={0} max={20} value={dsGrade} onChange={e => setDsGrade(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Commentaire :</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4} />
            </div>
            <button type="submit" disabled={submitting}>{submitting ? 'Envoi...' : 'Poster mon avis'}</button>
          </form>
        ) : (
          <p>Connecte-toi pour poster.</p>
        )}
      </section>

      {/* 2. ON APPELLE LE COMPOSANT REVIEWSLIST ICI */}
      <ReviewsList reviews={reviews} currentUser={user} onDelete={handleActionDelete} />
    </div>
  );
}

// Composant interne pour la liste
const ReviewsList = ({ reviews, currentUser, onDelete }: any) => (
  <section className="matiere-reviews">
    <h2>Avis ({reviews.length})</h2>
    {reviews.map((r: any) => (
      <div key={r.id} className="review-card">
        <div className="review-header">
          <strong>{r.users?.username ?? 'Anonyme'}</strong>
          {currentUser && currentUser.id === r.user_id && (
            <button onClick={() => onDelete(r.id)} style={{ color: 'red', marginLeft: '10px' }}>
              Supprimer
            </button>
          )}
        </div>
        <p>{r.comment}</p>
      </div>
    ))}
  </section>
);