import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PublicProfilePage.css';
import { useEffect, useState } from 'react';

export default function PublicProfilePage() {
  const { username } = useParams(); 
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicData = async () => {
    setLoading(true);
    try {
      //  On cherche l'utilisateur par son pseudo
      const { data: userProfile, error: userError } = await supabase
        .from('users') // Assure-toi que cette table existe !
        .select('id, avatar_url, username')
        .eq('username', username)
        .single();

      if (userError || !userProfile) throw new Error("Utilisateur non trouvé");

      //  On récupère ses reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*, subjects(name)')
        .eq('user_id', userProfile.id);

      if (reviewsError) throw reviewsError;

      setProfileData({ ...userProfile, reviews: reviews || [] });
    } catch (err) {
      console.error("Erreur profil public:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchPublicData();
  }, [username]);

  if (loading) return <div className="loading">Chargement du profil...</div>;
  if (!profileData) return <div className="error">Utilisateur {username} introuvable.</div>;

  return (
    <div className="profile-public-container">
      {/* EN-TÊTE : On affiche qui on regarde */}
      <div className="public-header">
        <img src={profileData.avatar_url} alt="Avatar" className="public-avatar" />
        <h2>Profil de {username}</h2>
        <p>{profileData.full_name}</p>
      </div>

      <div className="profile-body">
        <h3>Évaluations ({profileData.reviews.length})</h3>
        <div className="reviews-list">
          {profileData.reviews.length > 0 ? (
            profileData.reviews.map((review: any) => (
              <div key={review.id} className="review-card">
                <h4>{review.subjects?.name || "Matière inconnue"}</h4>
                <p className="card-rating">Note : <strong>{review.user_rating} / 10</strong></p> 
                <p className="card-comment">"{review.comment}"</p>
                <hr className="card-divider" />
                <p className="card-date">
                  Noté le {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))
          ) : (
            <p>Aucune évaluation trouvée pour cet utilisateur.</p>
          )}
        </div>
      </div>
    </div>
  );
}