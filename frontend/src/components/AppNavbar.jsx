import { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROL_LABEL } from '../constants/roles';

const ENLACES = [
  { to: '/', label: 'Inicio', roles: Object.values(ROLES), end: true },
  { to: '/citas/nueva', label: 'Solicitar cita', roles: [ROLES.DUENO] },
  { to: '/mis-citas', label: 'Mis citas', roles: [ROLES.DUENO] },
  { to: '/agenda', label: 'Agenda', roles: [ROLES.RECEPCION, ROLES.ADMIN] },
  { to: '/mascotas', label: 'Mascotas', roles: Object.values(ROLES) },
  { to: '/historial', label: 'Historial', roles: Object.values(ROLES) },
  { to: '/admin/usuarios', label: 'Usuarios', roles: [ROLES.ADMIN] },
  { to: '/ubicacion', label: 'Cómo llegar', roles: Object.values(ROLES) },
];

export default function AppNavbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const salir = () => {
    setExpanded(false);
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-vsm" variant="dark" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
          Veterinaria San Marcos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          {usuario && (
            <>
              <Nav className="me-auto">
                {ENLACES.filter((e) => e.roles.includes(usuario.rol)).map((e) => (
                  <Nav.Link key={e.to} as={NavLink} to={e.to} end={e.end} onClick={() => setExpanded(false)}>
                    {e.label}
                  </Nav.Link>
                ))}
              </Nav>
              <div className="d-flex align-items-lg-center flex-column flex-lg-row gap-2 text-white">
                <span>
                  {usuario.nombre} <small className="opacity-75">({ROL_LABEL[usuario.rol]})</small>
                </span>
                <Button variant="outline-light" size="sm" onClick={salir}>
                  Cerrar sesión
                </Button>
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
