import { citas as citasIniciales } from '../data/citas';

let citas = [...citasIniciales];

export const listarCitas = () => [...citas];

export const listarCitasDeDueno = (duenoId) =>
  citas.filter((c) => c.duenoId === duenoId);

export function crearCita(datos) {
  const nueva = {
    ...datos,
    id: Math.max(0, ...citas.map((c) => c.id)) + 1,
    estado: 'pendiente',
  };
  citas = [...citas, nueva];
  return nueva;
}

export function actualizarCita(id, cambios) {
  citas = citas.map((c) => (c.id === id ? { ...c, ...cambios } : c));
  return citas.find((c) => c.id === id);
}