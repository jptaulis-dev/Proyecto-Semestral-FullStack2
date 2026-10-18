import { historialInicial } from '../data/historial';
import { medicamentos } from '../data/medicamentos';

const CLAVE_HISTORIAL = 'vsm_historial';

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE_HISTORIAL);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Usa datos iniciales si localStorage falla
  }
  return [...historialInicial];
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(lista));
  } catch {
    // Ignorar error de almacenamiento
  }
}

export const listarHistorial = () => cargar();

export const listarHistorialDeMascotas = (mascotaIds) =>
  cargar().filter((h) => mascotaIds.includes(Number(h.mascotaId)));

export const listarMedicamentos = () => [...medicamentos];

export const obtenerMedicamento = (codigo) =>
  medicamentos.find((m) => m.codigo === codigo) || null;

export function crearRegistroHistorial(datos) {
  const lista = cargar();
  const nuevo = {
    ...datos,
    id: Math.max(0, ...lista.map((h) => h.id)) + 1,
    mascotaId: Number(datos.mascotaId),
  };
  guardar([nuevo, ...lista]);
  return nuevo;
}