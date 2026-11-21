import { obtenerServicio } from '../services/catalogoService';

export const enriquecerCita = (c, mascotas = []) => {
  const mascota = mascotas.find((m) => Number(m.id) === Number(c.mascotaId));
  return {
    ...c,
    hora: c.hora ? String(c.hora).slice(0, 5) : '',
    mascotaNombre: mascota?.nombre ?? 'Desconocida',
    servicioNombre: obtenerServicio(c.servicioCodigo)?.nombre ?? c.servicioCodigo,
  };
};

export const ordenarPorFecha = (lista) =>
  [...lista].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));