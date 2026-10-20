import { citas as citasIniciales } from '../data/citas';
import {
  listarCitas,
  listarCitasDeDueno,
  obtenerCita,
  crearCita,
  actualizarCita,
  eliminarCita,
  reiniciarCitas,
} from '../services/citasService';

describe('citasService (CRUD simulado y Spies)', () => {
  beforeEach(() => reiniciarCitas());
  afterAll(() => reiniciarCitas());

  // Prueba 1
  it('lista las citas iniciales correctamente', () => {
    expect(listarCitas().length).toBe(citasIniciales.length);
  });

  // Prueba 2
  it('filtra las citas pertenecientes a un dueño específico', () => {
    const citas = listarCitasDeDueno(1);
    expect(citas.length).toBeGreaterThan(0);
    expect(citas.every((c) => c.duenoId === 1)).toBeTrue();
  });

  // Prueba 3
  it('obtiene una cita por su id o retorna null si no existe', () => {
    const cita = obtenerCita(1);
    expect(cita).not.toBeNull();
    expect(cita.id).toBe(1);
    expect(obtenerCita(9999)).toBeNull();
  });

  // Prueba 4
  it('crea una cita nueva en estado pendiente con id autoincremental', () => {
    const nueva = crearCita({
      mascotaId: 1,
      duenoId: 1,
      servicioCodigo: 'SV001',
      fecha: '2026-11-10',
      hora: '10:00',
      motivo: 'Control sano',
    });
    expect(nueva.estado).toBe('pendiente');
    expect(listarCitas().length).toBe(citasIniciales.length + 1);
  });

  // Prueba 5 (SPY en localStorage tal como pide la guía del profesor)
  it('utiliza localStorage.setItem al guardar una nueva cita (Spy)', () => {
    const spyStorage = spyOn(Storage.prototype, 'setItem').and.callThrough();

    crearCita({
      mascotaId: 2,
      duenoId: 1,
      servicioCodigo: 'VA003',
      fecha: '2026-11-15',
      hora: '11:00',
      motivo: 'Vacuna anual',
    });

    expect(spyStorage).toHaveBeenCalled();
    expect(spyStorage.calls.mostRecent().args[0]).toBe('vsm_citas');
  });

  // Prueba 6
  it('actualiza únicamente el estado de la cita indicada', () => {
    const actualizada = actualizarCita(citasIniciales[0].id, { estado: 'cancelada' });
    expect(actualizada.estado).toBe('cancelada');
    expect(listarCitas()[1].estado).toBe(citasIniciales[1].estado);
  });

  // Prueba 7
  it('elimina una cita existente y devuelve false si el id no existe', () => {
    expect(eliminarCita(citasIniciales[0].id)).toBeTrue();
    expect(listarCitas().length).toBe(citasIniciales.length - 1);
    expect(eliminarCita(9999)).toBeFalse();
  });
});