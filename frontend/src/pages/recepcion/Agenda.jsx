import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { listarCitas, actualizarCita } from '../../services/citasService';
import { enriquecerCita, ordenarPorFecha } from '../../utils/citasUtils';
import TablaCitas from '../../components/citas/TablaCitas';
import FormReagendar from '../../components/citas/FormReagendar';

export default function Agenda() {
  const [citas, setCitas] = useState(() => listarCitas());
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [reagendando, setReagendando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const aplicarCambio = (id, cambios, texto) => {
    actualizarCita(id, cambios);
    setCitas(listarCitas());
    setReagendando(null);
    setMensaje(texto);
  };

  const citasEnriquecidas = ordenarPorFecha(citas).map(enriquecerCita);

  const citasFiltradas = citasEnriquecidas.filter((c) => {
    const coincideEstado = filtroEstado === 'TODOS' || c.estado.toLowerCase() === filtroEstado.toLowerCase();
    const coincideFecha = !filtroFecha || c.fecha === filtroFecha;
    const texto = `${c.mascotaNombre} ${c.servicioNombre} ${c.motivo}`.toLowerCase();
    const coincideBusqueda = !busqueda.trim() || texto.includes(busqueda.toLowerCase());
    return coincideEstado && coincideFecha && coincideBusqueda;
  });

  const limpiarFiltros = () => {
    setFiltroEstado('TODOS');
    setFiltroFecha('');
    setBusqueda('');
  };

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">📅 Agenda General de Citas</h1>
      {mensaje && (
        <Alert variant="success" dismissible onClose={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={4}>
              <Form.Group controlId="buscarAgenda">
                <Form.Label className="small fw-bold">Buscar paciente, servicio o motivo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Firulais, Vacuna, Control..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId="filtroEstado">
                <Form.Label className="small fw-bold">Estado</Form.Label>
                <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                  <option value="TODOS">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="reagendada">Reagendada</option>
                  <option value="cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId="filtroFecha">
                <Form.Label className="small fw-bold">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={2}>
              <Button variant="outline-secondary" className="w-100" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <TablaCitas
        citas={citasFiltradas}
        mensajeVacio="No se encontraron citas con los filtros seleccionados."
        renderAcciones={(c) =>
          reagendando === c.id ? (
            <FormReagendar
              cita={c}
              onCancelar={() => setReagendando(null)}
              onGuardar={({ fecha, hora }) =>
                aplicarCambio(c.id, { fecha, hora, estado: 'reagendada' }, 'Cita reagendada correctamente')
              }
            />
          ) : (
            <div className="d-flex flex-wrap gap-1">
              {c.estado !== 'confirmada' && c.estado !== 'cancelada' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => aplicarCambio(c.id, { estado: 'confirmada' }, 'Cita confirmada')}
                >
                  Confirmar
                </Button>
              )}
              {c.estado !== 'cancelada' && (
                <Button size="sm" variant="outline-primary" onClick={() => setReagendando(c.id)}>
                  Reagendar
                </Button>
              )}
              {c.estado !== 'cancelada' && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => aplicarCambio(c.id, { estado: 'cancelada' }, 'Cita cancelada')}
                >
                  Cancelar
                </Button>
              )}
            </div>
          )
        }
      />
    </Container>
  );
}