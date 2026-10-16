import { listarCitas, reiniciarCitas } from "../services/citasService";
import { listarCitasDeDueno } from "../services/citasService";
import { crearCita } from "../services/citasService";
import { actualizarCita } from "../services/citasService";
import { eliminarCita } from "../services/citasService";
import { actualizarCita } from "../services/citasService";

describe('citasService (CRUD simulado)', () => {
  beforeEach(() => reiniciarCitas());
  afterAll(() => reiniciarCitas());

  it('lista las citas iniciales', () => {
    expect(listarCitas().length).toBe(citasIniciales.length);
  });

  it('filtra las citas por dueño', () => {
    const citas = listarCitasDeDueno(1);
    expect(citas.length).toBeGreaterThan(0);
    expect(citas.every((c) => c.duenoId === 1)).toBeTrue();
  });

  it('crea una cita en estado pendiente con id nuevo', () => {
    const nueva = crearCita({
      mascotaId: 1, duenoId: 1, servicioCodigo: 'SV001',
      fecha: '2030-01-10', hora: '10:00', motivo: 'Control',
    });
    expect(nueva.estado).toBe('pendiente');
    expect(listarCitas().length).toBe(citasIniciales.length + 1);
    expect(citasIniciales.some((c) => c.id === nueva.id)).toBeFalse();
  });

  it('actualiza solo la cita indicada', () => {
    const actualizada = actualizarCita(citasIniciales[0].id, { estado: 'cancelada' });
    expect(actualizada.estado).toBe('cancelada');
    expect(listarCitas()[1].estado).toBe(citasIniciales[1].estado);
  });

  it('elimina una cita existente y devuelve false si no existe', () => {
    expect(eliminarCita(citasIniciales[0].id)).toBeTrue();
    expect(listarCitas().length).toBe(citasIniciales.length - 1);
    expect(eliminarCita(9999)).toBeFalse();
  });

  it('conserva los cambios al volver a leer (persistencia)', () => {
    crearCita({ mascotaId: 2, duenoId: 1, servicioCodigo: 'SV001', fecha: '2030-02-01', hora: '09:00', motivo: 'Prueba' });
    expect(listarCitas().some((c) => c.motivo === 'Prueba')).toBeTrue();
  });
});