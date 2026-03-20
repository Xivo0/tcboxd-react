import './App.css';

import NavBar from './NavBar';
import RecentReviews from './RecentReviews';
import SubjectsToRate from './SubjectsToRate';
import RankingPreview from './RankingPreview';
import Login from './Login';

import React, { useState } from 'react';
function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  if(!userEmail){
    return <Login onLogin={(email) => setUserEmail(email)} />
  }

  return (
    <>
    <NavBar />
    <h1 className='greetings'>Bienvenue, {userEmail}!</h1>
    <RecentReviews/>
    <SubjectsToRate/>
    <RankingPreview/>
    </>
  );
}

export default App;