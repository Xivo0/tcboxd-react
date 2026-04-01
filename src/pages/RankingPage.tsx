import { useEffect, useState } from 'react';
import './RankingPage.css';
import { getAllSubjects } from '../services/subjects';
import { getUserRatingStats } from '../services/reviews';
import { Link } from 'react-router-dom'; // Utilise react-router-dom pour la navigation

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [rankedSubjects, setRankedSubjects] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([getAllSubjects(), getUserRatingStats()])
      .then(([subjectsData, usersStats]) => {
        if (!mounted) return;
        const subs = Array.isArray(subjectsData) ? subjectsData.slice() : [];
        subs.sort((a: any, b: any) => (b.average_user_rating ?? 0) - (a.average_user_rating ?? 0));
        setRankedSubjects(subs);

        const users = Array.isArray(usersStats) ? usersStats : [];
        setUserStats(users);
      })
      .catch((err) => {
        console.error('Failed to load rankings', err);
        if (mounted) setError(String(err?.message ?? err));
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="ranking-page-container">
      <div className="ranking-header">
        <h1>Classements</h1>
        <div className="main-tabs">
          <button 
            className={`main-tab-button ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            Matières
          </button>
          <button 
            className={`main-tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs
          </button>
        </div>
      </div>

      <div className="leaderboard">
        {loading && <p>Chargement des classements...</p>}
        {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}

        {/* --- ONGLET MATIÈRES --- */}
        {activeTab === 'subjects' && rankedSubjects.map((subject: any, index: number) => {
          const rank = index + 1;
          return (
            <Link
              key={`sub-${subject.id}`}
              to={`/subjects/${subject.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="leaderboard-row clickable-row">
                <div className={`rank-badge rank-${rank}`}>{rank}</div>
                <div className="list-info">
                  <h3>{subject.name}</h3>
                </div>
                <div className="list-score">
                  <div className="score-number">
                    {(subject.average_user_rating ?? 0).toFixed(1)} <span className="score-max">/ 10</span>
                  </div>
                  <div className="score-subtitle">{subject.reviews_count ?? ''} avis</div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* --- ONGLET UTILISATEURS --- */}
        {activeTab === 'users' && (
          <div className="users-leaderboards" style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3 className="classementType">
                <span style={{ color: '#ffffff' }}>Suceurs (moyenne élevée)
                </span>
                </h3>
              {userStats.slice().sort((a, b) => b.avg - a.avg).map((u: any, i: number) => (
                <Link 
                  key={`su-${u.user_id}-${i}`} 
                  to={`/profile-public/${u.username}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="leaderboard-row clickable-row">
                    <div className={`rank-badge rank-${i + 1}`}>{i + 1}</div>
                    <div className="list-info">
                      <h3>{u.username ?? 'Anonyme'}</h3>
                    </div>
                    <div className="list-score">
                      <div className="score-number">{u.avg} <span className="score-max">/10</span></div>
                      <div className="score-subtitle">{u.count} avis</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>Haters (moyenne basse)</span>
              </h3>              
              {userStats.slice().sort((a, b) => a.avg - b.avg).map((u: any, i: number) => (
                <Link 
                  key={`ha-${u.user_id}-${i}`} 
                  to={`/profile-public/${u.username}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="leaderboard-row clickable-row">
                    <div className={`rank-badge rank-${i + 1}`}>{i + 1}</div>
                    <div className="list-info">
                      <h3>{u.username ?? 'Anonyme'}</h3>
                    </div>
                    <div className="list-score">
                      <div className="score-number">{u.avg} <span className="score-max">/10</span></div>
                      <div className="score-subtitle">{u.count} avis</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div> {/* Fin de leaderboard */}
    </div> // Fin de ranking-page-container
  );
}