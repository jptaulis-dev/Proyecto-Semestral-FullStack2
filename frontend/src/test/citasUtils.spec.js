import * as mascotasService from '../services/mascotasService';
import * as catalogoService from '../services/catalogoService';
import { enriquecerCita, ordenarPorFecha } from '../utils/citasUtils';

describe('utils/citasUtils', () => {
  describe('enriquecerCita', () => {
    it('agrega el nombre de la mascota y del servicio, conservando los demás campos', () => {
      spyOn(mascotasService, 'obtenerMascota').and.returnValue({ nombre: 'Firulais' });
      spyOn(catalogoService, 'obtenerServicio').and.returnValue({ nombre: 'Vacuna' });
      const cita = { id: 1, mascotaId: 3, servicioCodigo: 'VAC', motivo: 'Control' };

      const r = enriquecerCita(cita);

      expect(mascotasService.obtenerMascota).toHaveBeenCalledWith(3);
      expect(catalogoService.obtenerServicio).toHaveBeenCalledWith('VAC');
      expect(r.mascotaNombre).toBe('Firulais');
      expect(r.servicioNombre).toBe('Vacuna');
      expect(r.motivo).toBe('Control');
    });

    it('usa valores por defecto si la mascota o el servicio no existen', () => {
      spyOn(mascotasService, 'obtenerMascota').and.returnValue(null);
      spyOn(catalogoService, 'obtenerServicio').and.returnValue(null);
      const r = enriquecerCita({ id: 1, mascotaId: 99, servicioCodigo: 'XYZ' });
      expect(r.mascotaNombre).toBe('Desconocida');
      expect(r.servicioNombre).toBe('XYZ');
    });
  });

  describe('ordenarPorFecha', () => {
    const citas = [
      { id: 1, fecha: '2030-01-12', hora: '09:00' },
      { id: 2, fecha: '2030-01-10', hora: '15:00' },
      { id: 3, fecha: '2030-01-10', hora: '09:30' },
    ];

    it('ordena por fecha y, a igual fecha, por hora', () => {
      expect(ordenarPorFecha(citas).map((c) => c.id)).toEqual([3, 2, 1]);
    });

    it('no modifica la lista original', () => {
      ordenarPorFecha(citas);
      expect(citas.map((c) => c.id)).toEqual([1, 2, 3]);
    });

    it('devuelve una lista vacía si no hay citas', () => {
      expect(ordenarPorFecha([])).toEqual([]);
    });
  });
});