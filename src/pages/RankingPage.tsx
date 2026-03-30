import { useEffect, useState } from 'react';
import './RankingPage.css';
import { getAllSubjects } from '../services/subjects';
import { getUserRatingStats } from '../services/reviews';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [rankedSubjects, setRankedSubjects] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([getAllSubjects(), getUserRatingStats(), supabase.auth.getUser()])
      .then(([subjectsData, usersStats, userData]) => {
        if (!mounted) return;
        const subs = Array.isArray(subjectsData) ? subjectsData.slice() : [];
        subs.sort((a: any, b: any) => (b.average_user_rating ?? 0) - (a.average_user_rating ?? 0));
        setRankedSubjects(subs);

        const users = Array.isArray(usersStats) ? usersStats : [];
        setUserStats(users);
        
        if (userData.data.user) setCurrentUser(userData.data.user);
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
            <div key={`sub-${subject.id}`} className="leaderboard-row">
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
          );
        })}

        {/* --- ONGLET UTILISATEURS --- */}
        {activeTab === 'users' && (
          <div className="users-leaderboards" style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3>Suceurs (moyenne élevée)</h3>
              {userStats.slice().sort((a, b) => b.avg - a.avg).map((u: any, i: number) => (
                <div 
                  key={`su-${u.user_id}-${i}`} 
                  className="leaderboard-row clickable-row"
                  onClick={() => {
                    if (currentUser?.id === u.user_id) {
                      navigate('/profile');
                    } else {
                      navigate(`/profile-public/${u.username}`);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`rank-badge rank-${i + 1}`}>{i + 1}</div>
                  <div className="list-info">
                    <h3>{u.username ?? 'Anonyme'}</h3>
                  </div>
                  <div className="list-score">
                    <div className="score-number">{u.avg} <span className="score-max">/10</span></div>
                    <div className="score-subtitle">{u.count} avis</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <h3>Haters (moyenne basse)</h3>
              {userStats.slice().sort((a, b) => a.avg - b.avg).map((u: any, i: number) => (
                <div 
                  key={`ha-${u.user_id}-${i}`} 
                  className="leaderboard-row clickable-row"
                  onClick={() => {
                    if (currentUser?.id === u.user_id) {
                      navigate('/profile');
                    } else {
                      navigate(`/profile-public/${u.username}`);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`rank-badge rank-${i + 1}`}>{i + 1}</div>
                  <div className="list-info">
                    <h3>{u.username ?? 'Anonyme'}</h3>
                  </div>
                  <div className="list-score">
                    <div className="score-number">{u.avg} <span className="score-max">/10</span></div>
                    <div className="score-subtitle">{u.count} avis</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div> {/* Fin de leaderboard */}
    </div> // Fin de ranking-page-container
  );
}