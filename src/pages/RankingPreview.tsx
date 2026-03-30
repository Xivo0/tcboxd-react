import './RankingPreview.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopRaters, getTopHaters } from '../services/reviews';
import { supabase } from '../lib/supabase';

export default function RankingPreview() {
  const [topRaters, setTopRaters] = useState<any[]>([]);
  const [topHaters, setTopHaters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getTopRaters(),
      getTopHaters(),
      supabase.auth.getUser()
    ]).then(([ratersData, hatersData, userData]) => {
      setTopRaters(ratersData);
      setTopHaters(hatersData);
      if (userData.data.user) setCurrentUser(userData.data.user);
      setLoading(false);
    })
    .catch(err => {
      console.error('Erreur chargement classements:', err);
      setLoading(false);
    })
  }, []);

  if (loading) return <p>Chargement...</p>;

  const rankings = [
    {
      id: 1,
      title: "Top Suceurs",
      first: topRaters[0]?.users?.username ?? '???',
      firstUserId: topRaters[0]?.user_id,
      second: topRaters[1]?.users?.username ?? '???',
      secondUserId: topRaters[1]?.user_id,
      third: topRaters[2]?.users?.username ?? '???',
      thirdUserId: topRaters[2]?.user_id
    },
    {
      id: 2,
      title: "Top Haters",
      first: topHaters[0]?.users?.username ?? '???',
      firstUserId: topHaters[0]?.user_id,
      second: topHaters[1]?.users?.username ?? '???',
      secondUserId: topHaters[1]?.user_id,
      third: topHaters[2]?.users?.username ?? '???',
      thirdUserId: topHaters[2]?.user_id
    }
  ];

  return (
    <section className='ranking-section'>
      <h2 className='section-title'>Aperçu classement</h2>
      <div className='podiums-container'>
        {rankings.map((ranking) => (
          <div key={ranking.id} className='podium-wrapper'>
            <h3 className='podium-title'>{ranking.title}</h3>
            <div className='podium'>
              <div className='step step-second'>
                <span 
                  className='step-name' 
                  onClick={() => {
                    if (ranking.second !== '???') {
                      if (currentUser?.id === ranking.secondUserId) {
                        navigate('/profile');
                      } else {
                        navigate(`/profile-public/${ranking.second}`);
                      }
                    }
                  }}
                  style={{ cursor: ranking.second !== '???' ? 'pointer' : 'default' }}
                >
                  {ranking.second}
                </span>
                <span className='step-number'>2</span>
              </div>
              <div className='step step-first'>
                <span 
                  className='step-name' 
                  onClick={() => {
                    if (ranking.first !== '???') {
                      if (currentUser?.id === ranking.firstUserId) {
                        navigate('/profile');
                      } else {
                        navigate(`/profile-public/${ranking.first}`);
                      }
                    }
                  }}
                  style={{ cursor: ranking.first !== '???' ? 'pointer' : 'default' }}
                >
                  {ranking.first}
                </span>
                <span className='step-number'>1</span>
              </div>
              <div className='step step-third'>
                <span 
                  className='step-name' 
                  onClick={() => {
                    if (ranking.third !== '???') {
                      if (currentUser?.id === ranking.thirdUserId) {
                        navigate('/profile');
                      } else {
                        navigate(`/profile-public/${ranking.third}`);
                      }
                    }
                  }}
                  style={{ cursor: ranking.third !== '???' ? 'pointer' : 'default' }}
                >
                  {ranking.third}
                </span>
                <span className='step-number'>3</span>
              </div>
            </div>
            <div className='podium-base'></div>
          </div>
        ))}
      </div>
    </section>
  );
}