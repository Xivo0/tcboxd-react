import './App.css';
import Profil from './pages/ProfilePage'
import NavBar from './pages/NavBar';
import ListeMatieres from './pages/ListeMatieres';
import RecentReviews from './pages/RecentReviews';
import SubjectsToRate from './pages/SubjectsToRate';
import RankingPreview from './pages/RankingPreview';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={
        <div className="app-container">
          <RecentReviews/>
          <SubjectsToRate/>
          <RankingPreview/>
        </div>
      } />
	<Route path="/profile" element={
		<div className="app-container">
			<Profil/>
		</div>
	  } />
	<Route path="/matieres" element={
  		<div className="app-container">
    		<ListeMatieres />
  		</div>
	  } />
      <Route path="/course/:id" element = {
        <div className="app-container">
          <h2>Détails du cours</h2>
        </div>
      } />
    </Routes>
    </>
  );
}

export default App;