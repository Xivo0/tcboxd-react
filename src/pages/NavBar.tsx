import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import icone from '../assets/icon.png';
import '../App.css';
import type React from 'react';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    let mounted = true
    supabase.auth.getUser().then(res => { if(mounted) setUser(res.data.user) })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if(!mounted) return
      setUser(session?.user ?? null)
    })
    return ()=>{ mounted = false; sub?.subscription.unsubscribe() }
  },[])

  const loginWithGithub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin + '/' } })
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erreur déconnexion:", error.message);
    // redirect home
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche lancée !");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={icone} alt='icone' className='logo' />TCBoxd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to='/'>Accueil</Nav.Link>
            <Nav.Link as={Link} to='/classement'>Classements</Nav.Link>
            <NavDropdown title="Parcourir" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/matieres">
                Voir toutes les matières
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/professeurs">
                Voir tous les professeurs
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Partie droite — recherche + profil */}
          <div className="d-flex align-items-center gap-3">

            {/* Barre de recherche */}
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Chercher un cours..."
                className="me-2 rounded-pill"
                aria-label="Search"
              />
              <Button type="submit" variant="outline-success" className="rounded-pill">
                Rechercher
              </Button>
            </Form>

            {/* Bouton profil — dropdown */}
            <NavDropdown
              title={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z"/></svg>}
              id="profile-dropdown"
              align="end"
            >
              {user ? (
                <>
                  <NavDropdown.Header>{user.user_metadata?.full_name || user.email}</NavDropdown.Header>
                  <NavDropdown.Item as={Link} to="/profile">Voir profil</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Déconnexion</NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item onClick={loginWithGithub}>Connexion</NavDropdown.Item>
              )}
            </NavDropdown>

          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
