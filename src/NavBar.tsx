import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate} from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import icone from './assets/icon.png';
import './App.css'
import type React from 'react';

//source : https://react-bootstrap.netlify.app/docs/components/navbar/

export default function NavBar() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche lancée !");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/"><img src={icone} alt='icone' className='logo' />TCBoxd</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to='/'>Accueil</Nav.Link>
            <Nav.Link as={Link} to='/classement'>Classement</Nav.Link>
            
            <NavDropdown title="Matières" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/course/tc-ts-01">Traitement du Signal</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/course/tc-res-02">Réseaux</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/matieres">
                Voir toutes les matières
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Chercher un cours..."
              className="me-2 rounded-pill"
              aria-label="Search"
            />
            <Button type="submit" variant="outline-success" className="rounded-pill">Rechercher</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}