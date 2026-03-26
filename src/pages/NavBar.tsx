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

export default function NavBar() {
  const navigate = useNavigate();
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
            <Nav.Link as={Link} to='/classement'>Classement</Nav.Link>
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

            {/* Bouton profil — EN DEHORS du Form */}
            <Link to="/profile" className="profile-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path d="M2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z"/>
              </svg>
            </Link>

          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
