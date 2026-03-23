import './App.css';

import NavBar from './NavBar';
import RecentReviews from './RecentReviews';
import SubjectsToRate from './SubjectsToRate';
import RankingPreview from './RankingPreview';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';



const loginWithGithub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
options: {
      // Une fois connecté sur GitHub, il revient ici
      redirectTo: 'http://localhost:5173/', 
    },
  });

  if (error) console.error("Erreur de connexion :", error.message);
};
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
    
      

    <button onClick={loginWithGithub}>
      Se connecter avec mon compte Github
    </button>
    </>
  
  );
}

export default App;