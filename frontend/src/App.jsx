import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import MapaUbicacion from './components/MapaUbicacion';
import SolicitarCita from './pages/dueno/Solicitarcita';
import MisCitas from './pages/dueno/MisCitas';
import SolicitudesPendientes from './pages/recepcion/SolicitudesPendientes';
import Agenda from './pages/recepcion/Agenda';
import Mascotas from './pages/Mascotas';
import Historial from './pages/Historial';
import Usuarios from './pages/admin/Usuarios';
import Login from './pages/Login'; // Importamos el login real
import { ROLES } from './constants/roles';

function Inicio() {
  const { usuario } = useAuth();

  return (
    <div className="py-4">
      <Card className="shadow-sm mb-4 border-primary">
        <Card.Body>
          <Card.Title>🐾 Bienvenido al portal de Veterinaria San Marcos</Card.Title>
          <Card.Text className="text-muted mb-0">
            Has iniciado sesión exitosamente como <strong>{usuario?.nombre}</strong>. Utiliza el menú superior para navegar por las opciones disponibles para tu rol.
          </Card.Text>
        </Card.Body>
      </Card>

      <MapaUbicacion />
    </div>
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
            <Route path="/login" element={<Login />} />
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
              path="/historial"
              element={
                <ProtectedRoute roles={Object.values(ROLES)}>
                  <Historial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <Usuarios />
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