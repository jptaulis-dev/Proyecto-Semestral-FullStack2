import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import {
  listarMascotas,
  listarMascotasDeDueno,
  obtenerDuenoPorUsuario,
  obtenerMascota,
} from '../services/mascotasService';
import {
  listarHistorial,
  listarHistorialDeMascotas,
  listarMedicamentos,
  obtenerMedicamento,
  crearRegistroHistorial,
} from '../services/historialService';
import { hoy } from '../utils/horarios';

const VETERINARIOS = ['Dra. Carolina Reyes', 'Dr. Andrés Molina', 'Dr. Felipe Araya'];

export default function Historial() {
  const { usuario } = useAuth();
  const esPersonal = usuario.rol === ROLES.RECEPCION || usuario.rol === ROLES.ADMIN;
  const duenoActual = obtenerDuenoPorUsuario(usuario.id);

  const mascotasDisponibles = esPersonal
    ? listarMascotas()
    : duenoActual
    ? listarMascotasDeDueno(duenoActual.id)
    : [];

  const obtenerRegistrosSegunRol = () => {
    if (esPersonal) return listarHistorial();
    const ids = mascotasDisponibles.map((m) => m.id);
    return listarHistorialDeMascotas(ids);
  };

  const [registros, setRegistros] = useState(obtenerRegistrosSegunRol);
  const [filtroMascota, setFiltroMascota] = useState('TODAS');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    mascotaId: mascotasDisponibles[0]?.id ? String(mascotasDisponibles[0].id) : '',
    veterinario: VETERINARIOS[0],
    tipo: 'Consulta general',
    diagnostico: '',
    medicamentoCodigo: 'ME001',
    proximoControl: '',
  });
  const [errores, setErrores] = useState({});

  const medicamentos = listarMedicamentos();

  const validar = () => {
    const err = {};
    if (!form.mascotaId) err.mascotaId = 'Selecciona un paciente';
    if (form.diagnostico.trim().length < 10) {
      err.diagnostico = 'Ingresa el diagnóstico y tratamiento (mínimo 10 caracteres)';
    }
    if (!form.proximoControl) {
      err.proximoControl = 'Indica la fecha del próximo control o refuerzo de vacuna';
    }
    return err;
  };

  const registrarAtencion = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    crearRegistroHistorial({
      ...form,
      fecha: hoy(),
      diagnostico: form.diagnostico.trim(),
    });

    setRegistros(obtenerRegistrosSegunRol());
    setForm({ ...form, diagnostico: '', proximoControl: '' });
    setMensaje('Ficha clínica y receta actualizadas digitalmente.');
  };

  const registrosFiltrados = registros.filter((r) => {
    const coincideMascota = filtroMascota === 'TODAS' || r.mascotaId === Number(filtroMascota);
    const coincideTipo = filtroTipo === 'TODOS' || r.tipo === filtroTipo;
    return coincideMascota && coincideTipo;
  });

  // Avisos de vacunas o controles próximos a vencer
  const alertasVencimiento = registrosFiltrados.filter(
    (r) => r.proximoControl && r.proximoControl >= '2026-10-01' && r.proximoControl <= '2026-11-15'
  );

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">📋 Historial Clínico y Carnet de Vacunación</h1>

      {mensaje && (
        <Alert variant="success" dismissible onClose={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}

      {alertasVencimiento.length > 0 && (
        <Alert variant="warning" className="shadow-sm">
          <strong>🔔 Recordatorio de próximos controles y vacunas:</strong>
          <ul className="mb-0 mt-1 small">
            {alertasVencimiento.map((a) => (
              <li key={a.id}>
                <strong>{obtenerMascota(a.mascotaId)?.nombre}:</strong> Próximo control / refuerzo programado para el{' '}
                <strong>{a.proximoControl}</strong> ({a.tipo}).
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <Row className="g-4">
        <Col xs={12} lg={esPersonal ? 7 : 12}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Row className="g-2 mb-3">
                <Col xs={12} sm={6}>
                  <Form.Label className="small fw-bold">Filtrar por paciente</Form.Label>
                  <Form.Select value={filtroMascota} onChange={(e) => setFiltroMascota(e.target.value)}>
                    <option value="TODAS">Todas las mascotas</option>
                    {mascotasDisponibles.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.especie})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Label className="small fw-bold">Tipo de atención</Form.Label>
                  <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                    <option value="TODOS">Todos los registros</option>
                    <option value="Consulta general">Consulta general</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Consulta urgencia">Consulta urgencia</option>
                    <option value="Cirugía menor">Cirugía menor</option>
                  </Form.Select>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Paciente</th>
                      <th>Tipo / Médico</th>
                      <th>Diagnóstico y Medicamento</th>
                      <th>Próximo Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosFiltrados.map((r) => {
                      const mascota = obtenerMascota(r.mascotaId);
                      const med = obtenerMedicamento(r.medicamentoCodigo);
                      return (
                        <tr key={r.id}>
                          <td className="text-nowrap">{r.fecha}</td>
                          <td className="fw-bold">{mascota?.nombre ?? 'Paciente'}</td>
                          <td>
                            <Badge bg={r.tipo === 'Vacunación' ? 'success' : 'primary'} className="mb-1">
                              {r.tipo}
                            </Badge>
                            <div className="small text-muted">{r.veterinario}</div>
                          </td>
                          <td>
                            <div>{r.diagnostico}</div>
                            {med && (
                              <div className="small text-primary mt-1">
                                💊 <strong>Receta/Vacuna:</strong> {med.nombre} ({med.principio})
                              </div>
                            )}
                          </td>
                          <td className="text-nowrap">
                            <Badge bg="warning" text="dark">{r.proximoControl}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {registrosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-3">
                          No existen registros clínicos para el filtro seleccionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {esPersonal && (
          <Col xs={12} lg={5}>
            <Card className="shadow-sm border-success">
              <Card.Body>
                <Card.Title className="mb-3">🩺 Registrar Atención / Vacuna</Card.Title>
                <Form onSubmit={registrarAtencion} noValidate>
                  <Form.Group className="mb-3" controlId="histMascota">
                    <Form.Label>Paciente (Mascota)</Form.Label>
                    <Form.Select
                      value={form.mascotaId}
                      onChange={(e) => setForm({ ...form, mascotaId: e.target.value })}
                      isInvalid={!!errores.mascotaId}
                    >
                      <option value="">Selecciona paciente...</option>
                      {mascotasDisponibles.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} ({m.especie})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.mascotaId}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="histTipo">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                          value={form.tipo}
                          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                        >
                          <option value="Consulta general">Consulta general</option>
                          <option value="Vacunación">Vacunación</option>
                          <option value="Consulta urgencia">Consulta urgencia</option>
                          <option value="Cirugía menor">Cirugía menor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="histVet">
                        <Form.Label>Médico Veterinario</Form.Label>
                        <Form.Select
                          value={form.veterinario}
                          onChange={(e) => setForm({ ...form, veterinario: e.target.value })}
                        >
                          {VETERINARIOS.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="histMed">
                    <Form.Label>Medicamento o Vacuna aplicada (Stock Clínica)</Form.Label>
                    <Form.Select
                      value={form.medicamentoCodigo}
                      onChange={(e) => setForm({ ...form, medicamentoCodigo: e.target.value })}
                    >
                      {medicamentos.map((med) => (
                        <option key={med.codigo} value={med.codigo}>
                          {med.categoria}: {med.nombre} (Stock: {med.stock})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="histDiag">
                    <Form.Label>Diagnóstico y evolución</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={form.diagnostico}
                      onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
                      isInvalid={!!errores.diagnostico}
                    />
                    <Form.Control.Feedback type="invalid">{errores.diagnostico}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="histProximo">
                    <Form.Label>Fecha próximo control o vencimiento vacuna</Form.Label>
                    <Form.Control
                      type="date"
                      min={hoy()}
                      value={form.proximoControl}
                      onChange={(e) => setForm({ ...form, proximoControl: e.target.value })}
                      isInvalid={!!errores.proximoControl}
                    />
                    <Form.Control.Feedback type="invalid">{errores.proximoControl}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="success" className="w-100">
                    Guardar en Ficha Digital
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}