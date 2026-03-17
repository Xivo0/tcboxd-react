import './App.css';
import data from './mockData.json';
import icone from './assets/icon.png';



function App() {
  const coursesList = data.courses;

  return (
    <div className="app-container">
      
      <h1 className='title'> 
        <img src={icone} alt='icone' className='logo' />
        TCBoxd</h1>
      <p>La plateforme de notation des cours de Télécom</p>

      <div className="course-grid">
        {coursesList.map((course) => (
          <div key={course.id} className="course-card">
            <h2>{course.name}</h2>
            <p><strong>Professeur :</strong> {course.professor}</p>
            <p><strong>Note moyenne :</strong> {course.averageRating} / 5</p>
            <p className="description">{course.description}</p>
            <button>Voir les avis</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;