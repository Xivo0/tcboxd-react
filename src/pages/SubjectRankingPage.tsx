import { useState } from 'react';
import './SubjectRankingPage.css';

export default function SubjectRankingPage() {
  const [activeTab, setActiveTab] = useState('top-rated');

  // Les notes sont maintenant sur 10
  const rankedSubjects = [
    { id: 1, name: "Mathématiques Avancées", code: "TC101", rating: 9.6, reviews: 124 },
    { id: 2, name: "Algorithmique & C++", code: "INFO201", rating: 8.9, reviews: 98 },
    { id: 3, name: "Physique Quantique", code: "PH204", rating: 8.2, reviews: 85 },
    { id: 4, name: "Réseaux & Télécoms", code: "RT301", rating: 7.5, reviews: 110 },
    { id: 5, name: "Management & Entreprise", code: "SHS102", rating: 6.8, reviews: 45 },
    { id: 6, name: "Bases de Données", code: "INFO202", rating: 6.0, reviews: 80 },
  ];

  return (
    <div className="ranking-page-container">
      
      <div className="ranking-header">
        <h1>Classement des matières</h1>
        <p>Découvrez les cours les plus appréciés par les étudiants.</p>
        
        <div className="filter-tabs">
          <button 
            className={`tab-button ${activeTab === 'top-rated' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-rated')}
          >
            🌟 Mieux notées
          </button>
          <button 
            className={`tab-button ${activeTab === 'most-reviewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('most-reviewed')}
          >
            🔥 Plus populaires
          </button>
        </div>
      </div>

      <div className="leaderboard">
        {rankedSubjects.map((subject, index) => {
          const rank = index + 1;
          
          return (
            <div key={subject.id} className="leaderboard-row">
              
              <div className={`rank-badge rank-${rank}`}>
                {rank}
              </div>
              
              <div className="subject-info">
                <h3>{subject.name}</h3>
                <span className="subject-code">{subject.code}</span>
              </div>
              
              {/* Le bloc du score modifié */}
              <div className="subject-score">
                <div className="rating-number">
                  {subject.rating.toFixed(1)} <span className="rating-max">/ 10</span>
                </div>
                <div className="review-count">{subject.reviews} avis</div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}