import './RankingPreview.css';
import { useNavigate } from 'react-router-dom';

export default function RankingPreview(){
    const navigate = useNavigate();

    const rankings = [
    { id: 1, title: "Top Professeurs", path:"/classement/professeurs" },
    { id: 2, title: "Top Matières" , path:"/classement/matieres"},
    { id: 3, title: "Top Succès" , path:"/classement/succes"}
  ];
  return(
    <section className='ranking-section'>
        <h2 className='section-title'>Aperçu classement</h2>

        <div className='podiums-container'>
            {rankings.map((ranking) =>(
                <div key={ranking.id} className='podium-wrapper' onClick={()=>navigate(ranking.path)} style={{cursor :'pointer'}}>
                    <h3 className='podium-title'>{ranking.title}</h3>

                    <div className='podium'>
                        <div className='step step-second'>
                            <span className='step-number'>2</span>
                        </div>
                        <div className='step step-first'>
                            <span className='step-number'>1</span>
                        </div>
                        <div className='step step-third'>
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