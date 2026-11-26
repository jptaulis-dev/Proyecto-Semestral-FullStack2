import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import MapaUbicacion from './components/MapaUbicacion';
import SolicitarCita from './pages/dueno/SolicitarCita';
import MisCitas from './pages/dueno/MisCitas';
import SolicitudesPendientes from './pages/recepcion/SolicitudesPendientes';
import Agenda from './pages/recepcion/Agenda';
import Mascotas from './pages/Mascotas';
import Historial from './pages/Historial';
import Usuarios from './pages/admin/Usuarios';
import Login from './pages/Login'; // Importamos el login real
import { ROLES, ROL_LABEL } from './constants/roles';
import Footer from './components/Footer';

const SERVICIOS_DESTACADOS = [
  {
    icono: '🩺',
    titulo: 'Consulta General y Preventiva',
    descripcion: 'Evaluación integral, diagnóstico oportuno y seguimiento personalizado para el bienestar de tu mascota.',
    etiqueta: 'Atención integral',
  },
  {
    icono: '💉',
    titulo: 'Vacunación y Desparasitación',
    descripcion: 'Esquemas completos de inmunización y control antiparasitario con recordatorios en tu ficha digital.',
    etiqueta: 'Prevención',
  },
  {
    icono: '🏥',
    titulo: 'Cirugía Menor y Procedimientos',
    descripcion: 'Pabellón equipado y protocolos seguros con monitoreo continuo y cuidados postoperatorios.',
    etiqueta: 'Especialidad',
  },
  {
    icono: '📋',
    titulo: 'Historial Clínico Digital',
    descripcion: 'Consulta recetas, vacunas aplicadas y próximos controles desde cualquier dispositivo en tiempo real.',
    etiqueta: 'Portal en línea',
  },
];

function Inicio() {
  const { usuario } = useAuth();
  const esDueno = usuario?.rol === ROLES.DUENO;
  const esPersonal = usuario?.rol === ROLES.RECEPCION || usuario?.rol === ROLES.ADMIN;

  return (
    <div className="pb-5">
      <section
        className="text-white py-5 mb-5 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #14452f 0%, #1d6344 60%, #277d56 100%)',
          borderRadius: '1rem',
        }}
      >
        <Container>
          <Row className="align-items-center g-4">
            <Col xs={12} lg={8}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 fw-semibold">
                🐾 Clínica Veterinaria San Marcos · Rancagua
              </Badge>
              <h1 className="display-6 fw-bold mb-3">
                Hola, {usuario?.nombre || 'Bienvenido'} 👋
              </h1>
              <p className="lead mb-4 opacity-90" style={{ maxWidth: '640px' }}>
                Cuidamos la salud y felicidad de quienes son parte de tu familia. Gestiona citas, revisa fichas clínicas y accede a nuestros servicios veterinarios de forma simple y segura.
              </p>

              <div className="d-flex flex-wrap gap-2">
                {esDueno && (
                  <>
                    <Button as={Link} to="/citas/nueva" variant="warning" size="lg" className="fw-semibold text-dark">
                      📅 Solicitar Nueva Cita
                    </Button>
                    <Button as={Link} to="/mis-citas" variant="outline-light" size="lg">
                      Mis Citas
                    </Button>
                    <Button as={Link} to="/mascotas" variant="outline-light" size="lg">
                      Mis Mascotas
                    </Button>
                  </>
                )}

                {esPersonal && (
                  <>
                    <Button as={Link} to="/agenda" variant="warning" size="lg" className="fw-semibold text-dark">
                      📅 Ver Agenda General
                    </Button>
                    <Button as={Link} to="/solicitudes" variant="outline-light" size="lg">
                      Solicitudes Pendientes
                    </Button>
                    <Button as={Link} to="/mascotas" variant="outline-light" size="lg">
                      Fichas de Pacientes
                    </Button>
                  </>
                )}
              </div>
            </Col>

            <Col xs={12} lg={4}>
              <Card className="border-0 shadow text-dark" style={{ backgroundColor: 'rgba(255, 255, 255, 0.96)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-uppercase text-muted fw-bold">Sesión Activa</span>
                    <Badge bg="success">{ROL_LABEL[usuario?.rol] || usuario?.rol}</Badge>
                  </div>
                  <h2 className="h5 fw-bold mb-1">{usuario?.nombre}</h2>
                  <p className="small text-muted mb-3">{usuario?.email}</p>
                  <hr className="my-3" />
                  <div className="small text-secondary">
                    <div className="mb-1">🕒 <strong>Horario:</strong> Lun a Sáb · 09:00 a 19:00 hrs</div>
                    <div>📞 <strong>Urgencias y recepción:</strong> +56 72 234 5678</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-dark">Nuestros Servicios Veterinarios</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Contamos con atención médica integral y herramientas digitales para acompañar cada etapa de vida de tu mascota.
          </p>
        </div>

        <Row className="g-4">
          {SERVICIOS_DESTACADOS.map((srv) => (
            <Col key={srv.titulo} xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span style={{ fontSize: '2rem' }} aria-hidden="true">{srv.icono}</span>
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success-subtle">
                      {srv.etiqueta}
                    </Badge>
                  </div>
                  <Card.Title className="h6 fw-bold mb-2">{srv.titulo}</Card.Title>
                  <Card.Text className="small text-muted mb-0 flex-grow-1">
                    {srv.descripcion}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <Card className="border-0 bg-light shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <Row className="g-4 text-center">
              <Col xs={12} md={4}>
                <div className="fs-2 mb-2">👩‍⚕️</div>
                <h3 className="h6 fw-bold">Equipo Especializado</h3>
                <p className="small text-muted mb-0">
                  Médicos veterinarios comprometidos con un trato cercano, ético y libre de estrés para cada paciente.
                </p>
              </Col>
              <Col xs={12} md={4}>
                <div className="fs-2 mb-2">⚡</div>
                <h3 className="h6 fw-bold">Agendamiento Sin Filas</h3>
                <p className="small text-muted mb-0">
                  Reserva, confirma o reagenda tus horas médicas en línea con disponibilidad actualizada al instante.
                </p>
              </Col>
              <Col xs={12} md={4}>
                <div className="fs-2 mb-2">🔒</div>
                <h3 className="h6 fw-bold">Información Protegida</h3>
                <p className="small text-muted mb-0">
                  Acceso seguro por roles para tutores y personal clínico, manteniendo tus datos siempre resguardados.
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>

      <section>
        <MapaUbicacion />
      </section>
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
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}