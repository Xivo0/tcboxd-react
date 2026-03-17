import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import icone from './assets/icon.png';
import './App.css'

//source : https://react-bootstrap.netlify.app/docs/components/navbar/

export default function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#"><img src={icone} alt='icone' className='logo' />TCBoxd</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#accueil">Accueil</Nav.Link>
            <Nav.Link href="#classement">Classement</Nav.Link>
            <NavDropdown title="Matières" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#ts">Traitement du Signal</NavDropdown.Item>
              <NavDropdown.Item href="#res">Réseaux</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#toutes">
                Voir toutes les matières
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Chercher un cours..."
              className="me-2 rounded-pill"
              aria-label="Search"
            />
            <Button variant="outline-success" className="rounded-pill">Rechercher</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}