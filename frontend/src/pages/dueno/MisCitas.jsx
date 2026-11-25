import { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerDuenoPorUsuario, listarMascotasDeDueno } from '../../services/mascotasService';
import { listarCitasDeDueno, actualizarCita } from '../../services/citasService';
import { enriquecerCita, ordenarPorFecha } from '../../utils/citasUtils';
import TablaCitas from '../../components/citas/TablaCitas';

const CANCELABLES = ['pendiente', 'confirmada', 'reagendada'];

export default function MisCitas() {
  const { usuario } = useAuth();
  const [dueno, setDueno] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  const cargarDatos = async () => {
    const duenoData = await obtenerDuenoPorUsuario(usuario.id);
    setDueno(duenoData);
    if (duenoData) {
      const [listaCitas, listaMascotas] = await Promise.all([
        listarCitasDeDueno(duenoData.id),
        listarMascotasDeDueno(duenoData.id),
      ]);
      setCitas(listaCitas);
      setMascotas(listaMascotas);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario.id]);

  if (cargando) return <Container className="py-4"><p className="text-muted">Cargando citas...</p></Container>;
  if (!dueno) return <Alert variant="warning" className="m-3">No se encontró tu ficha de dueño.</Alert>;

  const cancelar = async (id) => {
    if (!window.confirm('¿Quieres cancelar esta cita?')) return;
    await actualizarCita(id, { estado: 'cancelada' });
    await cargarDatos();
  };

  const filas = ordenarPorFecha(citas).map((c) => enriquecerCita(c, mascotas));

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