import './RankingPreview.css';
import { useEffect, useState } from 'react';
import { getTopRaters, getTopHaters } from './services/reviews';

export default function RankingPreview() {
  const [topRaters, setTopRaters] = useState<any[]>([]);
  const [topHaters, setTopHaters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      <div className='podiums-container'>
        {rankings.map((ranking) => (
          <div key={ranking.id} className='podium-wrapper'>
            <h3 className='podium-title'>{ranking.title}</h3>
            <div className='podium'>
              <div className='step step-second'>
                <span className='step-name'>{ranking.second}</span>
                <span className='step-number'>2</span>
              </div>
              <div className='step step-first'>
                <span className='step-name'>{ranking.first}</span>
                <span className='step-number'>1</span>
              </div>
              <div className='step step-third'>
                <span className='step-name'>{ranking.third}</span>
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