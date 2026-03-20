import './SubjectsToRate.css';
import data from './mockData.json';
import { useNavigate } from 'react-router-dom';

export default function SubjectsToRate(){
    const coursesList = data.courses;
    const navigate = useNavigate();
    
    return(
        <section className="subjects-section">
      <h2 className="section-title">Matières à noter</h2>
      
      {/* Le conteneur de la grille */}
      <div className="subjects-grid">
        
        {coursesList.map((courses) => (
          <div key={courses.id} className="subject-card">
            <h3>{courses.name}</h3>
            <span className="subject-code">{courses.credits}</span>
            
            {/* Un petit bouton factice pour inviter au clic */}
            <button className="rate-button" onClick={() => navigate(`/course/${courses.id}`)}>Noter</button>
          </div>
        ))}

      </div>
    </section>
    )
}
