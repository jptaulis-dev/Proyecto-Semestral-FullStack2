import { apiFetch } from './api';
import { medicamentos } from '../data/medicamentos';

export async function listarHistorial() {
  return apiFetch('/historial');
}

export async function listarHistorialDeMascotas(mascotaIds) {
  const idsNumericos = (mascotaIds || []).map(Number);
  const lista = await listarHistorial();
  return lista.filter((h) => idsNumericos.includes(Number(h.mascotaId)));
}

export const listarMedicamentos = () => [...medicamentos];

export const obtenerMedicamento = (codigo) =>
  medicamentos.find((m) => m.codigo === codigo) || null;

export async function crearRegistroHistorial(datos) {
  return apiFetch('/historial', {
    method: 'POST',
    body: JSON.stringify({
      ...datos,
      mascotaId: Number(datos.mascotaId),
    }),
  });
}