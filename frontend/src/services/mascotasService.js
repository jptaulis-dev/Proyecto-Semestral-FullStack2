import { mascotas as mascotasIniciales } from '../data/mascotas';
import { duenos } from '../data/duenos';

const CLAVE_MASCOTAS = 'vsm_mascotas';

function cargarMascotas() {
  try {
    const guardado = localStorage.getItem(CLAVE_MASCOTAS);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si falla localStorage, usa datos iniciales
  }
  return [...mascotasIniciales];
}

function guardarMascotas(lista) {
  try {
    localStorage.setItem(CLAVE_MASCOTAS, JSON.stringify(lista));
  } catch {
    // Ignorar errores de almacenamiento
  }
}

export const listarDuenos = () => [...duenos];

export const obtenerDueno = (id) =>
  duenos.find((d) => d.id === Number(id)) || null;

export const obtenerDuenoPorUsuario = (usuarioId) =>
  duenos.find((d) => d.usuarioId === usuarioId || d.usuariosId === usuarioId) || null;

export const listarMascotas = () => cargarMascotas();

export const listarMascotasDeDueno = (duenoId) =>
  cargarMascotas().filter((m) => m.duenoId === Number(duenoId));

export const obtenerMascota = (id) =>
  cargarMascotas().find((m) => m.id === Number(id)) || null;

export function crearMascota(datos) {
  const lista = cargarMascotas();
  const nueva = {
    ...datos,
    id: Math.max(0, ...lista.map((m) => m.id)) + 1,
    duenoId: Number(datos.duenoId),
  };
  guardarMascotas([...lista, nueva]);
  return nueva;
}

export function actualizarMascota(id, cambios) {
  const lista = cargarMascotas().map((m) =>
    m.id === Number(id) ? { ...m, ...cambios, duenoId: Number(cambios.duenoId ?? m.duenoId) } : m
  );
  guardarMascotas(lista);
  return lista.find((m) => m.id === Number(id)) || null;
}