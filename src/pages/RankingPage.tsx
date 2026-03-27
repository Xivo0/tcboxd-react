import { useEffect, useState } from 'react';
import './RankingPage.css';
import { getTopRaters } from '../services/reviews';
import { getAllSubjects } from '../services/subjects';

export default function RankingPage() {
  // L'état qui définit quel onglet est actif (par défaut : les matières)
  const [activeTab, setActiveTab] = useState('subjects');
  const [rankedSubjects, setRankedSubjects] = useState<any[]>([])
  const [rankedUsers, setRankedUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)

    Promise.all([getAllSubjects(), getTopRaters()])
      .then(([subjectsData, topRatersData]) => {
        if(!mounted) return

        // subjectsData: sort by average_user_rating desc
        const subs = Array.isArray(subjectsData) ? subjectsData.slice() : []
        subs.sort((a: any, b: any) => (b.average_user_rating ?? 0) - (a.average_user_rating ?? 0))
        setRankedSubjects(subs)

        // topRatersData: array of { users: { username }, user_rating }
        const users = Array.isArray(topRatersData) ? topRatersData : []
        setRankedUsers(users)
      })
      .catch((err)=>{
        console.error('Failed to load rankings', err)
        if(mounted) setError(String(err?.message ?? err))
      })
      .finally(()=>{ if(mounted) setLoading(false) })

    return ()=>{ mounted = false }
  },[])

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
        {error && <p style={{color:'red'}}>Erreur: {error}</p>}
        
        {/* --- AFFICHAGE SI L'ONGLET "MATIÈRES" EST ACTIF --- */}
        {activeTab === 'subjects' && rankedSubjects.map((subject: any, index: number) => {
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
                  {(subject.average_user_rating ?? 0).toFixed(1)} <span className="score-max">/ 10</span>
                </div>
                <div className="score-subtitle">{subject.reviews_count ?? ''} avis</div>
              </div>
            </div>
          );
        })}

        {/* --- AFFICHAGE SI L'ONGLET "UTILISATEURS" EST ACTIF --- */}
        {activeTab === 'users' && rankedUsers.map((user: any, index: number) => {
          const rank = index + 1;
          return (
            <div key={`usr-${rank}-${user.users?.username ?? index}`} className="leaderboard-row">
              <div className={`rank-badge rank-${rank}`}>{rank}</div>
              
              <div className="list-info">
                <h3>{user.users?.username ?? 'Anonyme'}</h3>
                {/* On affiche la note moyenne que l'utilisateur a donnée */}
                <span className="info-badge user-role">Note donnée: {user.user_rating ?? 'N/A'}</span>
              </div>
              
              <div className="list-score">
                <div className="score-number">
                  {user.user_rating ?? 'N/A'} <span className="score-max">/ 10</span>
                </div>
                <div className="score-subtitle">Utilisateur actif</div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}