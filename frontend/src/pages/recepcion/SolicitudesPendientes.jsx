import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { listarCitas, actualizarCita } from '../../services/citasService';
import { enriquecerCita, ordenarPorFecha } from '../../utils/citasUtils';
import TablaCitas from '../../components/citas/TablaCitas';
import FormReagendar from '../../components/citas/FormReagendar';

export default function SolicitudesPendientes() {
  const [citas, setCitas] = useState(() => listarCitas());
  const [reagendando, setReagendando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const aplicar = (id, cambios, texto) => {
    actualizarCita(id, cambios);
    setCitas(listarCitas());
    setReagendando(null);
    setMensaje(texto);
  };

  const pendientes = ordenarPorFecha(citas.filter((c) => c.estado === 'pendiente')).map(enriquecerCita);

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Solicitudes pendientes</h1>
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}
      <TablaCitas
        citas={pendientes}
        mensajeVacio="No hay solicitudes pendientes."
        renderAcciones={(c) =>
          reagendando === c.id ? (
            <FormReagendar
              cita={c}
              onCancelar={() => setReagendando(null)}
              onGuardar={({ fecha, hora }) =>
                aplicar(c.id, { fecha, hora, estado: 'reagendada' }, 'Cita reagendada')
              }
            />
          ) : (
            <div className="d-flex flex-wrap gap-1">
              <Button size="sm" variant="success"
                onClick={() => aplicar(c.id, { estado: 'confirmada' }, 'Cita confirmada')}>
                Confirmar
              </Button>
              <Button size="sm" variant="outline-primary" onClick={() => setReagendando(c.id)}>
                Reagendar
              </Button>
              <Button size="sm" variant="outline-danger"
                onClick={() => aplicar(c.id, { estado: 'cancelada' }, 'Cita rechazada')}>
                Rechazar
              </Button>
            </div>
          )
        }
      />
    </Container>
  );
}