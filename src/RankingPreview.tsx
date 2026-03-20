import './RankingPreview.css';
import { useEffect, useState } from 'react';
import { getTopRaters, getTopHaters } from './services/reviews';
// ↑ deux fonctions qui lisent la table 'reviews' + JOIN 'users'

export default function RankingPreview() {

  const [topRaters, setTopRaters] = useState<any[]>([]);
  // ↑ contiendra les users avec les meilleures notes → table reviews
  
  const [topHaters, setTopHaters] = useState<any[]>([]);
  // ↑ contiendra les users avec les pires notes → table reviews

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      getTopRaters(),   // ↗ les deux appels partent
      getTopHaters()    // ↗ en même temps vers Supabase
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

  // On garde votre structure de podiums existante
  // mais on remplace les données statiques par les vraies
  const rankings = [
    { 
      id: 1, 
      title: "Top Suceurs",
      first: topRaters[0]?.users?.username ?? '???',
      // ↑ reviews[0].users.username = meilleure note
      // '??' = si undefined on affiche '???' à la place
      second: topRaters[1]?.users?.username ?? '???',
      third: topRaters[2]?.users?.username ?? '???'
    },
    { 
      id: 2, 
      title: "Top Haters",
      first: topHaters[0]?.users?.username ?? '???',
      // ↑ reviews[0].users.username = pire note
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
                // ↑ username de la 2ème place
                <span className='step-number'>2</span>
              </div>

              <div className='step step-first'>
                <span className='step-name'>{ranking.first}</span>
                // ↑ username de la 1ère place
                <span className='step-number'>1</span>
              </div>

              <div className='step step-third'>
                <span className='step-name'>{ranking.third}</span>
                // ↑ username de la 3ème place
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