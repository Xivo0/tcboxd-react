import data from '../mockData.json';
import './RecentReviews.css';
import { useNavigate } from 'react-router-dom';

export default function RecentReviews(){
    const coursesList = data.courses;
    const navigate = useNavigate()

    return (
        <section className="reviews-section">
      <h2 className="section-title">Reviews Récentes</h2>
      
      {/* C'est ce conteneur qui va défiler */}
      <div className="scroll-container">
        
        {coursesList.map((review) => (
          <div key={review.id} className="review-card" onClick={()=>navigate(`/course/${review.id}`)} style={{ cursor:'pointer'}}>
            <h3 >{review.name}</h3>
            <p>Par {review.professor}</p>
            {/* Ajoute ici les étoiles ou le contenu de ta review */}
          </div>
        ))}

      </div>
      
      {/* La ligne en dessous du défilement dans ton croquis */}
      <hr className="section-divider" />
    </section>
  );
    
}