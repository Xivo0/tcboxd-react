import { useState } from 'react';
import './RankingPage.css';

export default function RankingPage() {
  // L'état qui définit quel onglet est actif (par défaut : les matières)
  const [activeTab, setActiveTab] = useState('subjects');

  // Database 1 : Les matières
  const rankedSubjects = [
    { id: 1, name: "Mathématiques Avancées", code: "TC101", rating: 9.6, reviews: 124 },
    { id: 2, name: "Algorithmique & C++", code: "INFO201", rating: 8.9, reviews: 98 },
    { id: 3, name: "Physique Quantique", code: "PH204", rating: 8.2, reviews: 85 },
    { id: 4, name: "Réseaux & Télécoms", code: "RT301", rating: 7.5, reviews: 110 },
  ];

  // Database 2 : Les utilisateurs (ex: les plus actifs ou les meilleurs contributeurs)
  const rankedUsers = [
    { id: 1, name: "Alexandre Dupont", role: "Top Contributeur", points: 1450 },
    { id: 2, name: "Sophie Martin", role: "Expert Physique", points: 1220 },
    { id: 3, name: "Marc Tremblay", role: "Élève Actif", points: 980 },
    { id: 4, name: "Léo Garcia", role: "Nouvel Arrivant", points: 450 },
  ];

  return (
    <div className="ranking-page-container">
      
      <div className="ranking-header">
        <h1>Classements</h1>
        <p>Découvrez les meilleures matières et les étudiants les plus actifs.</p>
        
        {/* LES ONGLETS PRINCIPAUX */}
        <div className="main-tabs">
          <button 
            className={`main-tab-button ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            📚 Matières
          </button>
          <button 
            className={`main-tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            🏆 Utilisateurs
          </button>
        </div>
      </div>

      <div className="leaderboard">
        
        {/* --- AFFICHAGE SI L'ONGLET "MATIÈRES" EST ACTIF --- */}
        {activeTab === 'subjects' && rankedSubjects.map((subject, index) => {
          const rank = index + 1;
          return (
            <div key={`sub-${subject.id}`} className="leaderboard-row">
              <div className={`rank-badge rank-${rank}`}>{rank}</div>
              
              <div className="list-info">
                <h3>{subject.name}</h3>
                <span className="info-badge">{subject.code}</span>
              </div>
              
              <div className="list-score">
                <div className="score-number">
                  {subject.rating.toFixed(1)} <span className="score-max">/ 10</span>
                </div>
                <div className="score-subtitle">{subject.reviews} avis</div>
              </div>
            </div>
          );
        })}

        {/* --- AFFICHAGE SI L'ONGLET "UTILISATEURS" EST ACTIF --- */}
        {activeTab === 'users' && rankedUsers.map((user, index) => {
          const rank = index + 1;
          return (
            <div key={`usr-${user.id}`} className="leaderboard-row">
              <div className={`rank-badge rank-${rank}`}>{rank}</div>
              
              <div className="list-info">
                <h3>{user.name}</h3>
                {/* On réutilise le style du badge pour le rôle de l'utilisateur */}
                <span className="info-badge user-role">{user.role}</span>
              </div>
              
              <div className="list-score">
                <div className="score-number">
                  {user.points} <span className="score-max">pts</span>
                </div>
                <div className="score-subtitle">Contribution</div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}