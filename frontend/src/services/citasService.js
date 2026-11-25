import { apiFetch } from './api';

export async function listarCitas() {
  return apiFetch('/citas');
}

export async function listarCitasDeDueno(duenoId) {
  const todas = await listarCitas();
  return todas.filter((c) => Number(c.duenoId) === Number(duenoId));
}

export async function obtenerCita(id) {
  try {
    return await apiFetch(`/citas/${id}`);
  } catch {
    return null;
  }
}

export async function crearCita(datos) {
  return apiFetch('/citas', {
    method: 'POST',
    body: JSON.stringify({
      ...datos,
      mascotaId: Number(datos.mascotaId),
      duenoId: Number(datos.duenoId),
      estado: (datos.estado || 'pendiente').toLowerCase(),
    }),
  });
}

export async function actualizarCita(id, cambios) {
  const actual = await obtenerCita(id);
  const payload = {
    ...(actual || {}),
    ...cambios,
    ...(cambios.mascotaId !== undefined ? { mascotaId: Number(cambios.mascotaId) } : {}),
    ...(cambios.duenoId !== undefined ? { duenoId: Number(cambios.duenoId) } : {}),
    ...(cambios.estado ? { estado: cambios.estado.toLowerCase() } : {}),
  };
  return apiFetch(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function eliminarCita(id) {
  await apiFetch(`/citas/${id}`, {
    method: 'DELETE',
  });
  return true;
}