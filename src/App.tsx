import './App.css';

import NavBar from './NavBar';
import RecentReviews from './RecentReviews';
import SubjectsToRate from './SubjectsToRate';
import RankingPreview from './RankingPreview';
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