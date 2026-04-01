import './App.css';
import { Routes, Route } from 'react-router-dom';

import Profil from './pages/ProfilePage'
import NavBar from './pages/NavBar';
import ListeMatieres from './pages/ListeMatieres';
import RecentReviews from './pages/RecentReviews';
import SubjectsToRate from './pages/SubjectsToRate';
import RankingPreview from './pages/RankingPreview';
import Matieres from './pages/Matieres';
import SubjectRankingPage from './pages/RankingPage';
import ListesProfs from './pages/ListesProfs';
import PublicProfilePage from './pages/PublicProfile';
import ProfessorPage from './pages/ProfessorPage';

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {}
        <Route path="/" element={
          <div className="app-container">
            <RecentReviews/>
            <SubjectsToRate/>
            <RankingPreview/>
          </div>
        } />

        {/* Profil utilisateur */}
        <Route path="/profile" element={
          <div className="app-container">
            <Profil/>
          </div>
        } />

        {/* Liste globale des matières */}
        <Route path="/matieres" element={
          <div className="app-container">
            <ListeMatieres />
          </div>
        } />

        {/* Page détaillée d'une matière (Celle qu'on a codée ensemble) */}
        <Route path="/subjects/:id" element={
          <div className="app-container">
            <Matieres />
          </div>
        } />

        {/* Liste des professeurs */}
        <Route path="/professeurs" element={
          <div className="app-container">
            <ListesProfs />
          </div>
        } />
        {/* Profil public d'un utilisateur */}
        <Route path="/profile-public/:username" element={
          <div className="app-container">
            <PublicProfilePage />
          </div>
          } />

        {/* Page détaillée d'un professeur */}
        <Route path="/professeurs/:id" element={
          <div className="app-container">
            <ProfessorPage />
          </div>
        } />

        {/* Classement des matières */}
        <Route path='/Classement' element={
          <div className="app-container">
            <SubjectRankingPage/>
          </div>
        }/>
      </Routes>
    </>
  );
}

export default App;