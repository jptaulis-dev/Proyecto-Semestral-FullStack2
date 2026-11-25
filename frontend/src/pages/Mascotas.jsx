import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import {
  listarMascotas,
  listarMascotasDeDueno,
  listarDuenos,
  obtenerDuenoPorUsuario,
  crearMascota,
  actualizarMascota,
} from '../services/mascotasService';

const FORM_INICIAL = { nombre: '', especie: 'perro', sexo: 'macho', fechaNacimiento: '', duenoId: '' };

export default function Mascotas() {
  const { usuario } = useAuth();
  const esPersonalClinica = usuario.rol === ROLES.RECEPCION || usuario.rol === ROLES.ADMIN;

  const [duenoActual, setDuenoActual] = useState(null);
  const [duenos, setDuenos] = useState([]);
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    const [listaDuenos, dueno] = await Promise.all([
      listarDuenos(),
      obtenerDuenoPorUsuario(usuario.id),
    ]);
    setDuenos(listaDuenos);
    setDuenoActual(dueno);

    if (esPersonalClinica) {
      setLista(await listarMascotas());
    } else if (dueno) {
      setLista(await listarMascotasDeDueno(dueno.id));
    } else {
      setLista([]);
    }

    setForm((prev) => ({
      ...prev,
      duenoId: prev.duenoId || (dueno ? String(dueno.id) : listaDuenos[0]?.id ? String(listaDuenos[0].id) : ''),
    }));
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario.id]);

  const validar = () => {
    const err = {};
    if (form.nombre.trim().length < 2) err.nombre = 'El nombre debe tener al menos 2 caracteres';
    if (!form.especie) err.especie = 'Selecciona una especie';
    if (!form.sexo) err.sexo = 'Selecciona el sexo';
    if (!form.fechaNacimiento) err.fechaNacimiento = 'Ingresa la fecha de nacimiento';
    else if (form.fechaNacimiento > new Date().toISOString().slice(0, 10)) {
      err.fechaNacimiento = 'La fecha no puede ser futura';
    }
    if (!form.duenoId) err.duenoId = 'Selecciona el dueño responsable';
    return err;
  };

  const guardar = async (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    if (editandoId) {
      await actualizarMascota(editandoId, {
        nombre: form.nombre.trim(),
        especie: form.especie,
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento,
        duenoId: Number(form.duenoId),
      });
      setMensaje('Ficha de mascota actualizada correctamente.');
    } else {
      await crearMascota({
        nombre: form.nombre.trim(),
        especie: form.especie,
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento,
        duenoId: Number(form.duenoId),
      });
      setMensaje('Nueva mascota registrada en el sistema.');
    }

    await cargarDatos();
    setEditandoId(null);
    setForm({
      ...FORM_INICIAL,
      duenoId: duenoActual ? String(duenoActual.id) : duenos[0]?.id ? String(duenos[0].id) : '',
    });
  };

  const iniciarEdicion = (m) => {
    setEditandoId(m.id);
    setErrores({});
    setForm({
      nombre: m.nombre,
      especie: m.especie,
      sexo: m.sexo,
      fechaNacimiento: m.fechaNacimiento,
      duenoId: String(m.duenoId),
    });
  };

  const mascotasFiltradas = lista.filter((m) =>
    `${m.nombre} ${m.especie}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">🐾 {esPersonalClinica ? 'Fichas de Pacientes (Mascotas)' : 'Mis Mascotas'}</h1>
      {mensaje && (
        <Alert variant="success" dismissible onClose={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}

      <Row className="g-4">
        <Col xs={12} lg={esPersonalClinica ? 7 : 12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Buscar mascota por nombre o especie..."
                className="mb-3"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Especie</th>
                      <th>Sexo</th>
                      <th>Nacimiento</th>
                      {esPersonalClinica && <th>Dueño</th>}
                      {esPersonalClinica && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {mascotasFiltradas.map((m) => {
                      const dueno = duenos.find((d) => Number(d.id) === Number(m.duenoId));
                      return (
                        <tr key={m.id}>
                          <td className="fw-bold">{m.nombre}</td>
                          <td className="text-capitalize">
                            <Badge bg="info" text="dark">{m.especie}</Badge>
                          </td>
                          <td className="text-capitalize">{m.sexo}</td>
                          <td>{m.fechaNacimiento}</td>
                          {esPersonalClinica && <td>{dueno?.nombre ?? 'Sin dueño'}</td>}
                          {esPersonalClinica && (
                            <td>
                              <Button size="sm" variant="outline-primary" onClick={() => iniciarEdicion(m)}>
                                Editar
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {mascotasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-3">
                          No hay mascotas registradas que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {esPersonalClinica && (
          <Col xs={12} lg={5}>
            <Card className="shadow-sm border-primary">
              <Card.Body>
                <Card.Title className="mb-3">
                  {editandoId ? '✏️ Editar Ficha de Paciente' : '➕ Registrar Nuevo Paciente'}
                </Card.Title>
                <Form onSubmit={guardar} noValidate>
                  <Form.Group className="mb-3" controlId="nombreMascota">
                    <Form.Label>Nombre de la mascota</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      isInvalid={!!errores.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="especieMascota">
                        <Form.Label>Especie</Form.Label>
                        <Form.Select
                          value={form.especie}
                          onChange={(e) => setForm({ ...form, especie: e.target.value })}
                        >
                          <option value="perro">Perro</option>
                          <option value="gato">Gato</option>
                          <option value="conejo">Conejo</option>
                          <option value="ave">Ave</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="sexoMascota">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select
                          value={form.sexo}
                          onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                        >
                          <option value="macho">Macho</option>
                          <option value="hembra">Hembra</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="fechaNacMascota">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.fechaNacimiento}
                      onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                      isInvalid={!!errores.fechaNacimiento}
                    />
                    <Form.Control.Feedback type="invalid">{errores.fechaNacimiento}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="duenoMascota">
                    <Form.Label>Dueño responsable</Form.Label>
                    <Form.Select
                      value={form.duenoId}
                      onChange={(e) => setForm({ ...form, duenoId: e.target.value })}
                      isInvalid={!!errores.duenoId}
                    >
                      <option value="">Selecciona dueño...</option>
                      {duenos.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nombre} ({d.telefono})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.duenoId}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" className="w-100">
                      {editandoId ? 'Guardar Cambios' : 'Registrar Mascota'}
                    </Button>
                    {editandoId && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setEditandoId(null);
                          setErrores({});
                          setForm({ ...FORM_INICIAL, duenoId: duenos[0]?.id ? String(duenos[0].id) : '' });
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}