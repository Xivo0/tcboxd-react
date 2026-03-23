import './ProfilePage.css';

export default function ProfilePage() {
  // 1. FAUSSES DONNÉES (Ce qui viendra de ta base de données)
  const user = {
    name: "Alexandre Dupont",
    email: "alex.dupont@insa.fr",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", 
    role: "Étudiant - 3ème année"
  };

  const ratedSubjects = [
    { id: 1, name: "Mathématiques", code: "TC101", rating: 5, comment: "Explications super claires, prof au top !", date: "12 Mars 2026" },
    { id: 2, name: "Physique Quantique", code: "PH204", rating: 3, comment: "Matière intéressante mais le rythme est trop rapide.", date: "05 Mars 2026" },
    { id: 3, name: "Réseaux & Télécoms", code: "RT301", rating: 4, comment: "TPs très formateurs, je recommande.", date: "28 Fév 2026" },
    { id: 4, name: "Management", code: "SHS102", rating: 2, comment: "Pas très utile à mon goût, beaucoup de théorie.", date: "15 Fév 2026" },
  ];

  // Petite fonction maison pour afficher les étoiles 
  const renderStars = (rating: number) => {
    return (
      <span className="stars">
        {"★".repeat(rating)}
        <span className="stars-empty">{"★".repeat(5 - rating)}</span>
      </span>
    );
  };

  return (
    <div className="profile-container">
      
      {/* EN-TÊTE DU PROFIL */}
      <div className="profile-header">
        <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <span className="profile-badge">{user.role}</span>
        </div>
      </div>

      <div className="profile-body">
        <h3 className="section-title">Mes matières évaluées ({ratedSubjects.length})</h3>

        {/* GRILLE DES AVIS */}
        <div className="ratings-grid">
          
          {ratedSubjects.map((subject) => (
            <div key={subject.id} className="rating-card">
              
              <div className="card-header">
                <h4>{subject.name}</h4>
                <span className="subject-badge">{subject.code}</span>
              </div>

              <div className="card-rating">
                {renderStars(subject.rating)}
              </div>

              <p className="card-comment">"{subject.comment}"</p>

              <hr className="card-divider" />

              <p className="card-date">Noté le {subject.date}</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}