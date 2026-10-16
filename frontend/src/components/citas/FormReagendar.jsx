import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { HORAS, hoy } from '../../utils/horarios';
import { listarCitas } from '../../services/citasService';

export default function FormReagendar({ cita, onGuardar, onCancelar }) {
  const [fecha, setFecha] = useState(cita.fecha);
  const [hora, setHora] = useState(cita.hora);
  const [error, setError] = useState('');

  const guardar = (e) => {
    e.preventDefault();
    if (!fecha || fecha < hoy()) return setError('Elige una fecha válida (hoy o posterior)');
    if (!hora) return setError('Elige una hora');
    const ocupada = listarCitas().some(
      (c) => c.id !== cita.id && c.fecha === fecha && c.hora === hora && c.estado !== 'cancelada'
    );
    if (ocupada) return setError('Ese horario ya está ocupado');
    return onGuardar({ fecha, hora });
  };

  return (
    <Form onSubmit={guardar} noValidate className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
      <Form.Control type="date" size="sm" min={hoy()} value={fecha} aria-label="Nueva fecha"
        onChange={(e) => { setFecha(e.target.value); setError(''); }} />
      <Form.Select size="sm" value={hora} aria-label="Nueva hora"
        onChange={(e) => { setHora(e.target.value); setError(''); }}>
        {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
      </Form.Select>
      <Button type="submit" size="sm">Guardar</Button>
      <Button variant="outline-secondary" size="sm" onClick={onCancelar}>Cancelar</Button>
      {error && <div className="text-danger small" role="alert">{error}</div>}
    </Form>
  );
}