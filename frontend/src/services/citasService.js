import { citas as citasIniciales } from '../data/citas';

const CLAVE = 'vsm_citas';

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // si el almacenamiento falla, se usan los datos iniciales
  }
  return [...citasIniciales];
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // sin almacenamiento los cambios solo viven durante la sesión
  }
}

export const listarCitas = () => cargar();

export const listarCitasDeDueno = (duenoId) =>
  cargar().filter((c) => c.duenoId === duenoId);

export const obtenerCita = (id) => cargar().find((c) => c.id === id) || null;

export function crearCita(datos) {
  const lista = cargar();
  const nueva = {
    ...datos,
    id: Math.max(0, ...lista.map((c) => c.id)) + 1,
    estado: 'pendiente',
  };
  guardar([...lista, nueva]);
  return nueva;
}

export function actualizarCita(id, cambios) {
  const lista = cargar().map((c) => (c.id === id ? { ...c, ...cambios } : c));
  guardar(lista);
  return lista.find((c) => c.id === id) || null;
}

export function eliminarCita(id) {
  const lista = cargar();
  const quedan = lista.filter((c) => c.id !== id);
  guardar(quedan);
  return quedan.length < lista.length;
}

// Se usa en las pruebas para volver a los datos iniciales
export function reiniciarCitas() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // nada que limpiar
  }
}