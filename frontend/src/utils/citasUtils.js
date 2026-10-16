import { obtenerMascota } from '../services/mascotasService';
import { obtenerServicio } from '../services/catalogoService';

export const enriquecerCita = (c) => ({
  ...c,
  mascotaNombre: obtenerMascota(c.mascotaId)?.nombre ?? 'Desconocida',
  servicioNombre: obtenerServicio(c.servicioCodigo)?.nombre ?? c.servicioCodigo,
});

export const ordenarPorFecha = (lista) =>
  [...lista].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));