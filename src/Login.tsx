import './Login.css';

import React, { useState } from 'react';   

type LoginProps = {
    onLogin: (userEmail: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        if(!email || !password){
            setError('Email et mot de passe requis');
            return;
        }
        if (password !=='1234'){
            setError('Mot de passe incorrect');
            return;
        }
        setError('');
        onLogin(email);
    }
    return(
        <main className='login-page'>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Mot de passe:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <p className="error">{error}</p>}
                <button type="submit">Se connecter</button>
            </form>
        </main>
    );
}