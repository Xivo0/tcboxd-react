import { useEffect, useState } from 'react';
import { getRecentReviews } from '../services/reviews';
import { getAllSubjects } from '../services/subjects';
import './RecentReviews.css';
import { useNavigate } from 'react-router-dom';

type Review = {
  id: string
  comment?: string
  user_id?: string
  subject_id?: string
  ds_grade?: number
  user_rating?: number
  users?: { username?: string }
}

export default function RecentReviews(){
    const [reviews, setReviews] = useState<Review[]>([])
    const [subjectsMap, setSubjectsMap] = useState<Record<string,string>>({})
    const navigate = useNavigate()

    useEffect(()=>{
      let mounted = true
      Promise.all([getRecentReviews(12), getAllSubjects()])
        .then(([reviewsData, subjectsData])=>{
          if(!mounted) return
          if(reviewsData) setReviews(reviewsData as Review[])
          const map: Record<string,string> = {}
          if(subjectsData && Array.isArray(subjectsData)){
            subjectsData.forEach((s: any)=>{
              if(s && s.id) map[s.id] = s.name
            })
          }
          setSubjectsMap(map)
        })
        .catch((err)=>{
          console.error('Failed to load recent reviews or subjects', err)
        })
      return ()=>{ mounted = false }
    },[])

    return (
        <section className="reviews-section">
      <h2 className="section-title">Reviews Récentes</h2>
      
      {/* C'est ce conteneur qui va défiler */}
      <div className="scroll-container">
        
        {reviews.map((review) => (
          <div key={review.id} className="review-card" onClick={()=>navigate(`/course/${review.subject_id}`)} style={{ cursor:'pointer'}}>
            <h3 >{review.users?.username ?? 'Anonyme'}</h3>
            <p>{review.comment ?? 'Pas de commentaire'}</p>
            <p>Note: {review.user_rating ?? 'N/A'}</p>
            <p>Note DS: {review.ds_grade ?? 'N/A'}</p>
            <p>Matière: {subjectsMap[review.subject_id ?? ''] ?? 'Inconnue'}</p>
          </div>
        ))}

      </div>
      
      {/* La ligne en dessous du défilement dans ton croquis */}
      <hr className="section-divider" />
    </section>
  );
    
}