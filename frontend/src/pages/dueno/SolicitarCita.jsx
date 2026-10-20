import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerDuenoPorUsuario, listarMascotasDeDueno, obtenerMascota } from '../../services/mascotasService';
import { serviciosParaMascota, obtenerServicio } from '../../services/catalogoService';
import { crearCita, listarCitas } from '../../services/citasService';

// Horario simulado (el caso no lo indica): bloques de 30 min entre 09:00 y 17:30
const HORAS = Array.from({ length: 18 }, (_, i) => {
  const min = 9 * 60 + i * 30;
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
});

const hoy = () => new Date().toISOString().slice(0, 10);
const FORM_VACIO = { mascotaId: '', servicioCodigo: '', fecha: '', hora: '', motivo: '' };

export default function SolicitarCita() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const dueno = obtenerDuenoPorUsuario(usuario.id);
  const misMascotas = dueno ? listarMascotasDeDueno(dueno.id) : [];

  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});

  const mascota = form.mascotaId ? obtenerMascota(Number(form.mascotaId)) : null;
  const opcionesServicio = mascota ? serviciosParaMascota(mascota) : [];
  const servicio = form.servicioCodigo ? obtenerServicio(form.servicioCodigo) : null;

  const cambiar = (e) => {
    const { name, value } = e.target;
    // Al cambiar de mascota se reinicia el servicio, porque depende de la especie
    setForm((f) => ({ ...f, [name]: value, ...(name === 'mascotaId' ? { servicioCodigo: '' } : {}) }));
  };

  const validar = () => {
    const err = {};
    if (!form.mascotaId) err.mascotaId = 'Selecciona una mascota';
    if (!form.servicioCodigo) err.servicioCodigo = 'Selecciona un servicio';
    if (!form.fecha) err.fecha = 'Selecciona una fecha';
    else if (form.fecha < hoy()) err.fecha = 'La fecha no puede ser anterior a hoy';
    if (!form.hora) err.hora = 'Selecciona una hora';
    if (form.motivo.trim().length < 5) err.motivo = 'Describe el motivo (mínimo 5 caracteres)';
    if (!err.fecha && !err.hora) {
      const ocupada = listarCitas().some(
        (c) => c.fecha === form.fecha && c.hora === form.hora && c.estado !== 'cancelada'
      );
      if (ocupada) err.hora = 'Ese horario ya está ocupado, elige otro';
    }
    return err;
  };

  const enviar = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length > 0) return;
    crearCita({
      mascotaId: Number(form.mascotaId),
      duenoId: dueno.id,
      servicioCodigo: form.servicioCodigo,
      fecha: form.fecha,
      hora: form.hora,
      motivo: form.motivo.trim(),
    });
    navigate('/mis-citas');
  };

  if (!dueno) return <Alert variant="warning" className="m-3">No se encontró tu ficha de dueño.</Alert>;

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-3">Solicitar cita</h1>
      <Form onSubmit={enviar} noValidate>
        <Form.Group className="mb-3" controlId="mascotaId">
          <Form.Label>Mascota</Form.Label>
          <Form.Select name="mascotaId" value={form.mascotaId} onChange={cambiar} isInvalid={!!errores.mascotaId}>
            <option value="">Selecciona...</option>
            {misMascotas.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.mascotaId}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="servicioCodigo">
          <Form.Label>Servicio</Form.Label>
          <Form.Select name="servicioCodigo" value={form.servicioCodigo} onChange={cambiar}
            disabled={!mascota} isInvalid={!!errores.servicioCodigo}>
            <option value="">{mascota ? 'Selecciona...' : 'Primero elige una mascota'}</option>
            {opcionesServicio.map((s) => (
              <option key={s.codigo} value={s.codigo}>{s.categoria} - {s.nombre}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.servicioCodigo}</Form.Control.Feedback>
        </Form.Group>

        {servicio && (
          <Alert variant="info">
            Duración aprox.: {servicio.duracionMin} min · Precio: ${servicio.precio.toLocaleString('es-CL')}
            {servicio.observaciones && <div className="small mt-1">{servicio.observaciones}</div>}
          </Alert>
        )}

        <div className="row">
          <Form.Group className="col-12 col-md-6 mb-3" controlId="fecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type="date" name="fecha" min={hoy()} value={form.fecha}
              onChange={cambiar} isInvalid={!!errores.fecha} />
            <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-12 col-md-6 mb-3" controlId="hora">
            <Form.Label>Hora</Form.Label>
            <Form.Select name="hora" value={form.hora} onChange={cambiar} isInvalid={!!errores.hora}>
              <option value="">Selecciona...</option>
              {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.hora}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <Form.Group className="mb-3" controlId="motivo">
          <Form.Label>Motivo de la consulta</Form.Label>
          <Form.Control as="textarea" rows={3} name="motivo" value={form.motivo}
            onChange={cambiar} isInvalid={!!errores.motivo} />
          <Form.Control.Feedback type="invalid">{errores.motivo}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 w-md-auto">Enviar solicitud</Button>
      </Form>
    </Container>
  );
}