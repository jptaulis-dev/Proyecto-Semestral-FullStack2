import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert } from 'react-bootstrap';
import { ROLES, ROL_LABEL } from '../../constants/roles';
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  alternarEstadoUsuario,
} from '../../services/usuariosService';

const FORM_VACIO = { nombre: '', email: '', rol: ROLES.DUENO };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(listarUsuarios);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const validar = () => {
    const err = {};
    if (form.nombre.trim().length < 3) err.nombre = 'El nombre debe tener mínimo 3 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      err.email = 'Ingresa un correo electrónico válido';
    }
    if (!form.rol) err.rol = 'Selecciona un rol';
    return err;
  };

  const guardar = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    if (editandoId) {
      actualizarUsuario(editandoId, {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
      });
      setMensaje('Usuario actualizado correctamente.');
    } else {
      crearUsuario({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
      });
      setMensaje('Nuevo usuario creado en el sistema.');
    }

    setUsuarios(listarUsuarios());
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setErrores({});
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol });
  };

  const cambiarEstado = (id) => {
    alternarEstadoUsuario(id);
    setUsuarios(listarUsuarios());
    setMensaje('Estado del usuario actualizado.');
  };

  const filtrados = usuarios.filter((u) =>
    `${u.nombre} ${u.email} ${u.rol}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">⚙️ Panel de Administración de Usuarios</h1>
      {mensaje && (
        <Alert variant="success" dismissible onClose={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}

      <Row className="g-4">
        <Col xs={12} lg={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Buscar usuario por nombre, correo o rol..."
                className="mb-3"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((u) => (
                      <tr key={u.id}>
                        <td className="fw-bold">{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>
                          <Badge bg="secondary">{ROL_LABEL[u.rol] ?? u.rol}</Badge>
                        </td>
                        <td>
                          <Badge bg={u.activo ? 'success' : 'danger'}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <Button size="sm" variant="outline-primary" onClick={() => editar(u)}>
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant={u.activo ? 'outline-danger' : 'outline-success'}
                              onClick={() => cambiarEstado(u.id)}
                            >
                              {u.activo ? 'Desactivar' : 'Activar'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={5}>
          <Card className="shadow-sm border-dark">
            <Card.Body>
              <Card.Title className="mb-3">
                {editandoId ? '✏️ Editar Usuario y Rol' : '➕ Crear Nuevo Usuario'}
              </Card.Title>
              <Form onSubmit={guardar} noValidate>
                <Form.Group className="mb-3" controlId="userNombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    isInvalid={!!errores.nombre}
                  />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="userEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    isInvalid={!!errores.email}
                  />
                  <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="userRol">
                  <Form.Label>Rol asignado (RBAC)</Form.Label>
                  <Form.Select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    isInvalid={!!errores.rol}
                  >
                    <option value={ROLES.DUENO}>Dueño de mascota</option>
                    <option value={ROLES.RECEPCION}>Recepcionista / Operador</option>
                    <option value={ROLES.ADMIN}>Administrador</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="dark" className="w-100">
                    {editandoId ? 'Guardar Cambios' : 'Crear Usuario'}
                  </Button>
                  {editandoId && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setEditandoId(null);
                        setErrores({});
                        setForm(FORM_VACIO);
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
      </Row>
    </Container>
  );
}