import './App.css';
import data from './mockData.json';
import icone from './assets/icon.png';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './NavBar.jsx';


function App() {
  const coursesList = data.courses;
  const navigate = useNavigate();

  return (
    <>
    <NavBar />
    <Routes>
        <Route path="/" element={
          <div className="app-container">
            <h1 className='title'> 
              <img src={icone} alt='icone' className='logo' />
              TCBoxd
            </h1>
            <p>La plateforme de notation des cours de Télécom</p>
            <div className="course-grid">
              {coursesList.map((course) => (
                <div key={course.id} className="course-card">
                  <h2>{course.name}</h2>
                  <button onClick={() => navigate(`/course/${course.id}`)}>
                    Voir les avis
                  </button>
                </div>
              ))}
            </div>
          </div>
        } />
        <Route path="/course/:id" element={<div className="app-container"><h1>Détails du cours</h1></div>} />
      </Routes>
    </>
  );
}

export default App;