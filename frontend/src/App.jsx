import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Card, Button, ButtonGroup } from 'react-bootstrap';
import { AuthProvider, useAuth, USUARIOS_DEMO } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import MapaUbicacion from './components/MapaUbicacion';
import SolicitarCita from './pages/dueno/Solicitarcita';
import MisCitas from './pages/dueno/MisCitas';
import SolicitudesPendientes from './pages/recepcion/SolicitudesPendientes';
import { ROLES } from './constants/roles';
import Agenda from './pages/recepcion/Agenda';
import Mascotas from './pages/Mascotas';

function Inicio() {
  const { usuario, login } = useAuth();

  return (
    <div className="py-4">
      <Card className="shadow-sm mb-4 border-primary">
        <Card.Body>
          <Card.Title>🐾 Bienvenido a Veterinaria San Marcos, {usuario?.nombre}</Card.Title>
          <Card.Text className="text-muted mb-3">
            Panel de prueba de roles: cambia de usuario aquí abajo para ver cómo se adapta el menú de navegación según los permisos del sistema.
          </Card.Text>
          <ButtonGroup className="flex-wrap">
            {USUARIOS_DEMO.map((u) => (
              <Button
                key={u.id}
                variant={usuario?.rol === u.rol ? 'primary' : 'outline-primary'}
                onClick={() => login(u)}
              >
                Ver como: {u.rol} ({u.nombre})
              </Button>
            ))}
          </ButtonGroup>
        </Card.Body>
      </Card>

      <MapaUbicacion />
    </div>
  );
}

function LoginDemo() {
  const { login } = useAuth();
  return (
    <Card className="mx-auto mt-5 shadow-sm" style={{ maxWidth: '420px' }}>
      <Card.Body className="text-center">
        <h3 className="mb-3">Iniciar Sesión</h3>
        <p className="text-muted">Selecciona una cuenta para ingresar al sistema:</p>
        <div className="d-grid gap-2">
          {USUARIOS_DEMO.map((u) => (
            <Button
              key={u.id}
              variant="primary"
              as="a"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                login(u);
                window.location.href = '/';
              }}
            >
              Ingresar como {u.rol} ({u.nombre})
            </Button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <style>{`.navbar-vsm { background-color: #1b4332; }`}</style>
        <AppNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/login" element={<LoginDemo />} />
            <Route
              path="/"
              element={
                <ProtectedRoute roles={Object.values(ROLES)}>
                  <Inicio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citas/nueva"
              element={
                <ProtectedRoute roles={[ROLES.DUENO]}>
                  <SolicitarCita />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-citas"
              element={
                <ProtectedRoute roles={[ROLES.DUENO]}>
                  <MisCitas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitudes"
              element={
                <ProtectedRoute roles={[ROLES.RECEPCION, ROLES.ADMIN]}>
                  <SolicitudesPendientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agenda"
              element={
                <ProtectedRoute roles={[ROLES.RECEPCION, ROLES.ADMIN]}>
                  <Agenda />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mascotas"
              element={
                <ProtectedRoute roles={Object.values(ROLES)}>
                  <Mascotas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ubicacion"
              element={
                <ProtectedRoute roles={Object.values(ROLES)}>
                  <MapaUbicacion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/no-autorizado"
              element={<h3 className="text-danger mt-5 text-center">⛔ No tienes permisos para ver esta sección.</h3>}
            />
            <Route path="*" element={<h4 className="text-center mt-5">🚧 Vista en construcción...</h4>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}