import { apiFetch } from './api';

export async function listarUsuarios() {
  return apiFetch('/usuarios');
}

export async function crearUsuario(datos) {
  return apiFetch('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password || 'password123',
      rol: datos.rol,
      activo: datos.activo ?? true,
    }),
  });
}

export async function actualizarUsuario(id, cambios) {
  return apiFetch(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cambios),
  });
}

export async function alternarEstadoUsuario(id) {
  const usuarios = await listarUsuarios();
  const actual = usuarios.find((u) => Number(u.id) === Number(id));
  if (!actual) {
    throw new Error('Usuario no encontrado');
  }
  return actualizarUsuario(id, {
    ...actual,
    activo: !actual.activo,
  });
}