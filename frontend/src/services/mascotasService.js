import { mascotas } from '../data/mascotas';
import { duenos } from '../data/duenos';

export const obtenerDuenoPorUsuario = (usuarioId) =>
  duenos.find((d) => d.usuarioId === usuarioId) || null;

export const listarMascotasDeDueno = (duenoId) =>
  mascotas.filter((m) => m.duenoId === duenoId);

export const obtenerMascota = (id) =>
  mascotas.find((m) => m.id === id) || null;