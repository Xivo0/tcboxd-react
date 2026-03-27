import './App.css';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useEffect, useState } from 'react';

// Import de tes pages
import Profil from './pages/ProfilePage'
import NavBar from './pages/NavBar';
import ListeMatieres from './pages/ListeMatieres';
import RecentReviews from './pages/RecentReviews';
import SubjectsToRate from './pages/SubjectsToRate';
import RankingPreview from './pages/RankingPreview';
import Matieres from './pages/Matieres';
import SubjectRankingPage from './pages/RankingPage';
import ListesProfs from './pages/ListesProfs';

// --- FONCTIONS D'AUTH ---
const loginWithGithub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:5173/',
    },
  });
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Erreur déconnexion:", error.message);
  // On force le retour à l'accueil et on vide l'état
  window.location.href = "/";
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {/* Barre de navigation toujours visible */}
      <NavBar user={user} loginWithGithub={loginWithGithub} logout={logout} />

      <Routes>
        {/* Accueil */}
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

        {/* Redirection si cours spécifique (optionnel selon ton projet) */}
        <Route path="/course/:id" element = {
          <div className="app-container">
            <h2>Détails du cours</h2>
          </div>
        } />

        {/* Liste des professeurs */}
        <Route path="/professeurs" element={
          <div className="app-container">
            <ListesProfs />
          </div>
        } />

        {/* Statistiques d'un professeur */}
        <Route path="/profs/:id" element = {
          <div className="app-container">
            <h2>Statistiques du professeur</h2>
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