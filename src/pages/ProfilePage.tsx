import './ProfilePage.css';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  // --- ÉTATS (States) ---
  const [user, setUser] = useState<any>(null);
  const [ratedSubjects, setRatedSubjects] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  // --- LOGIQUE DE RÉCUPÉRATION (Le fameux GET) ---
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Récupération de la session utilisateur
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setLoading(false);
        return; 
      }

      const authUser = session.user;

      // On stocke les infos profil (nom, email, avatar)
      setUser({
        name: authUser.user_metadata.full_name || authUser.user_metadata.user_name || "Utilisateur",
        email: authUser.email,
        avatarUrl: authUser.user_metadata.avatar_url,
        role: "Étudiant" // Tu peux changer cela si tu as une colonne role
      });

      // 2. Récupération des reviews + infos des matières (Jointure)
      // Note : On récupère bien 'user_rating' ET 'ds_grade'
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_rating,
          ds_grade,
          comment,
          created_at,
          subjects (
            id,
            name
          )
        `)
        .eq('user_id', authUser.id);

      if (reviewsError) throw reviewsError;
      setRatedSubjects(reviewsData || []);

    } catch (err: any) {
      console.error("Erreur détaillée lors du chargement du profil :", err.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // --- FONCTION ÉTOILES ---
  // Transforme une note sur 10 en 5 étoiles max
  const renderStars = (rating: number) => {
    const starsOnFive = Math.round(rating / 2); 
    return (
      <span className="stars">
        {"★".repeat(starsOnFive)}
        <span className="stars-empty">{"★".repeat(5 - starsOnFive)}</span>
      </span>
    );
  };

  // --- ÉTATS DE CHARGEMENT / ERREUR ---
  if (loading) return <div className="loader">Chargement de ton profil...</div>;
  
  if (!user) return (
    <div className="error-container">
      <p>⚠️ Connecte-toi pour voir ton profil.</p>
    </div>
  );

  // --- RENDU FINAL ---
  return (
    <div className="profile-container">
      
      {/* SECTION : EN-TÊTE DU PROFIL */}
      <div className="profile-header">
        <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <span className="profile-badge">{user.role}</span>
        </div>
      </div>

      {/* SECTION : CORPS DU PROFIL */}
      <div className="profile-body">
        <h3 className="section-title">Mes matières évaluées ({ratedSubjects.length})</h3>

        <div className="ratings-grid">
          {ratedSubjects.length > 0 ? (
            ratedSubjects.map((review) => (
              <div key={review.id} className="rating-card" onClick={()=> navigate(`/subjects/${review.subjects.id}`)}>
                
                {/* Titre de la matière */}
                <div className="card-header">
                  <h4 className="subject-name">{review.subjects?.name || "Matière inconnue"}</h4>
                  {/* On affiche "TC" par défaut si pas de code */}
                  <span className="subject-badge">TC</span> 
                </div>

                {/* Note globale (Étoiles) */}
                <div className="card-rating">
                  <span className="rating-label">Avis global :</span>
                  {renderStars(review.user_rating)} 
                  <span className="rating-number">{review.user_rating}/10</span>
                </div>

                {/* Note du DS (Si elle existe) */}
                {review.ds_grade !== null && (
                  <div className="card-ds">
                    <span className="label">Note DS :</span>
                    <span className="ds-number">{review.ds_grade}/20</span>
                  </div>
                )}

                {/* Commentaire */}
                <p className="card-comment">"{review.comment}"</p>
                
                <hr className="card-divider" />
                
                {/* Date */}
                <p className="card-date">
                  Noté le {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))
          ) : (
            <p className="no-reviews">Tu n'as pas encore évalué de matières.</p>
          )}
        </div>
      </div>
    </div>
  );
}