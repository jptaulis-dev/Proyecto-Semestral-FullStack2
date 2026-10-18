import { usuariosIniciales } from '../data/usuarios';

const CLAVE_USUARIOS = 'vsm_usuarios';

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Usa datos iniciales
  }
  return [...usuariosIniciales];
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
  } catch {
    // Ignorar errores de almacenamiento
  }
}

export const listarUsuarios = () => cargar();

export function crearUsuario(datos) {
  const lista = cargar();
  const nuevo = {
    ...datos,
    id: Math.max(0, ...lista.map((u) => u.id)) + 1,
    activo: true,
  };
  guardar([...lista, nuevo]);
  return nuevo;
}

export function actualizarUsuario(id, cambios) {
  const lista = cargar().map((u) => (u.id === Number(id) ? { ...u, ...cambios } : u));
  guardar(lista);
  return lista.find((u) => u.id === Number(id)) || null;
}

export function alternarEstadoUsuario(id) {
  const lista = cargar().map((u) =>
    u.id === Number(id) ? { ...u, activo: !u.activo } : u
  );
  guardar(lista);
  return lista.find((u) => u.id === Number(id)) || null;
}