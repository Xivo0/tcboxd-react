import './App.css';


//import NavBar from './NavBar';
import RecentReviews from './RecentReviews';
import SubjectsToRate from './SubjectsToRate';
import RankingPreview from './RankingPreview';
import NavBar from './NavBar';

import Login from './Login';
import { useState } from 'react';
import ProfilePage from './ProfilePage';


function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  

  return (
    <> {!userEmail ? (
        // Si pas d'email -> on affiche le Login
        <Login onLogin={(email) => setUserEmail(email)} />
      ) : (
        // Si l'email existe -> on affiche le site
        <>
        
          <NavBar/>
          <h1 className='greetings'>Bienvenue, {userEmail}!</h1>
          <RecentReviews/>
          <SubjectsToRate/>
          <RankingPreview/>
          <ProfilePage/>
        </>
      )}</>
     
   
  );
}

export default App;