import { apiFetch } from './api';

export async function listarDuenos() {
  return apiFetch('/duenos');
}

export async function obtenerDueno(id) {
  try {
    return await apiFetch(`/duenos/${id}`);
  } catch {
    return null;
  }
}

export async function obtenerDuenoPorUsuario(usuarioId) {
  try {
    return await apiFetch(`/duenos/por-usuario/${usuarioId}`);
  } catch {
    return null;
  }
}

export async function listarMascotas() {
  return apiFetch('/mascotas');
}

export async function listarMascotasDeDueno(duenoId) {
  const todas = await listarMascotas();
  return todas.filter((m) => Number(m.duenoId) === Number(duenoId));
}

export async function obtenerMascota(id) {
  try {
    return await apiFetch(`/mascotas/${id}`);
  } catch {
    return null;
  }
}

export async function crearMascota(datos) {
  return apiFetch('/mascotas', {
    method: 'POST',
    body: JSON.stringify({
      ...datos,
      duenoId: Number(datos.duenoId),
    }),
  });
}

export async function actualizarMascota(id, cambios) {
  const actual = await obtenerMascota(id);
  const payload = {
    ...(actual || {}),
    ...cambios,
    duenoId: Number(cambios.duenoId ?? actual?.duenoId),
  };
  return apiFetch(`/mascotas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}