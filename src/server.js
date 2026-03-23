const express = require('express');
const session = require('express-session');
const CASAuthentication = require('cas-authentication');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Configuration Supabase (Utilise tes vraies clés ici)
const supabase = createClient('URL_SUPABASE', 'SERVICE_ROLE_KEY');

app.use(session({
    secret: 'mon_secret_insa',
    resave: false,
    saveUninitialized: true
}));

const cas = new CASAuthentication({
    cas_url: 'https://cas.insa-lyon.fr',
    service_url: 'http://localhost:4000',
    cas_version: '3.0'
});

// La route que ton bouton React va appeler
app.get('/login', cas.bounce, async (req, res) => {
    const userEmail = req.session[cas.session_name] + "@insa-lyon.fr";
    
    // Logique Supabase : On connecte l'utilisateur sans mot de passe
    const { data, error } = await supabase.auth.admin.createUser({
        email: userEmail,
        email_confirm: true
    });

    // Une fois fini, on redirige l'élève vers ton site React
    res.redirect('http://localhost:3000'); 
});

app.listen(4000, () => console.log("Proxy lancé sur le port 4000"));