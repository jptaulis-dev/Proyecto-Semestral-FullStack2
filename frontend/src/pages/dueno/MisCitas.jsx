import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerDuenoPorUsuario } from '../../services/mascotasService';
import { listarCitasDeDueno, actualizarCita } from '../../services/citasService';
import { enriquecerCita, ordenarPorFecha } from '../../utils/citasUtils';
import TablaCitas from '../../components/citas/TablaCitas';

const CANCELABLES = ['pendiente', 'confirmada', 'reagendada'];

export default function MisCitas() {
  const { usuario } = useAuth();
  const dueno = obtenerDuenoPorUsuario(usuario.id);
  const [citas, setCitas] = useState(() => (dueno ? listarCitasDeDueno(dueno.id) : []));

  if (!dueno) return <Alert variant="warning" className="m-3">No se encontró tu ficha de dueño.</Alert>;

  const cancelar = (id) => {
    if (!window.confirm('¿Quieres cancelar esta cita?')) return;
    actualizarCita(id, { estado: 'cancelada' });
    setCitas(listarCitasDeDueno(dueno.id));
  };

  const filas = ordenarPorFecha(citas).map(enriquecerCita);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 m-0">Mis citas</h1>
        <Button as={Link} to="/citas/nueva">Solicitar cita</Button>
      </div>
      <TablaCitas
        citas={filas}
        mensajeVacio="Aún no tienes citas. ¡Solicita la primera!"
        renderAcciones={(c) =>
          CANCELABLES.includes(c.estado) && (
            <Button size="sm" variant="outline-danger" onClick={() => cancelar(c.id)}>
              Cancelar
            </Button>
          )
        }
      />
    </Container>
  );
}