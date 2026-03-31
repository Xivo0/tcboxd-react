import './RankingPreview.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopRaters, getTopHaters } from '../services/reviews';

export default function RankingPreview() {
  const [topRaters, setTopRaters] = useState<any[]>([]);
  const [topHaters, setTopHaters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getTopRaters(),
      getTopHaters()
    ]).then(([ratersData, hatersData]) => {
      setTopRaters(ratersData);
      setTopHaters(hatersData);
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
      second: topRaters[1]?.users?.username ?? '???',
      third: topRaters[2]?.users?.username ?? '???'
    },
    {
      id: 2,
      title: "Top Haters",
      first: topHaters[0]?.users?.username ?? '???',
      second: topHaters[1]?.users?.username ?? '???',
      third: topHaters[2]?.users?.username ?? '???'
    }
  ];

  return (
    <section className='ranking-section'>
      <h2 className='section-title'>Aperçu classement</h2>
      <div className='rankings-container'>
        {rankings.map((ranking) => (
          <div key={ranking.id} className='ranking-list'>
            <h3 className='ranking-title' onClick={()=> navigate(`/classement`)}>
              {ranking.title}
            </h3>
            <ol className='ranking-items'>
              {['first', 'second', 'third'].map((position, index) => {
                const name = ranking[position as 'first' | 'second' | 'third']
                if (!name) return null
                return (
                  <li key={position} className='ranking-item'>
                    <span className='ranking-position'>{index + 1}.</span>
                    <span
                      className={`ranking-name ${name !== '???' ? 'clickable' : ''}`}
                      onClick={() => name !== '???' && navigate(`/profile-public/${name}`)}
                    >
                      {name}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}