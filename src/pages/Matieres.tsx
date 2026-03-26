import './Matieres.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../services/subjects';
import { getReviewsBySubject, addReview } from '../services/reviews';
import type React from 'react';

export default function Matieres() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [username, setUsername] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [dsGrade, setDsGrade] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getSubjectById(id),
      getReviewsBySubject(id)
    ]).then(([subjectData, reviewsData]) => {
      setSubject(subjectData);
      setReviews(reviewsData);
      setLoading(false);
    }).catch(err => {
      console.error('Erreur:', err);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      await addReview(username, id, rating, dsGrade, comment, false, 0.0);
      const updatedReviews = await getReviewsBySubject(id);
      setReviews(updatedReviews);
      setUsername('');
      setRating(5);
      setDsGrade(0);
      setComment('');
    } catch (err) {
      console.error('Erreur envoi avis:', err);
    }
    setSubmitting(false);
  };

  if (loading) return <p>Chargement...</p>;
  if (!subject) return <p>Matière introuvable</p>;

  return (
    <div className="matiere-page">

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <section className="matiere-header">
        <h1>{subject.name}</h1>
        {subject.full_name && <h2>{subject.full_name}</h2>}
        <p><strong>Domaine :</strong> {subject.domains?.name}</p>
        <p><strong>Année :</strong> {subject.year}</p>
        <p><strong>Note moyenne :</strong> {subject.average_user_rating}/10</p>
        <p><strong>Professeurs :</strong>{' '}
          {subject.subject_professors?.map((sp: any) => (
            <span key={sp.professors.id}>{sp.professors.name} </span>
          ))}
        </p>
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
            </div>
            <p>{review.comment}</p>
            <small>{new Date(review.created_at).toLocaleDateString('fr-FR')}</small>
          </div>
        ))}
      </section>

    </div>
  );
}