import {
  listarHistorial,
  listarHistorialDeMascotas,
  listarMedicamentos,
  obtenerMedicamento,
  crearRegistroHistorial,
} from '../services/historialService';
import { historialInicial } from '../data/historial';
import { medicamentos } from '../data/medicamentos';

describe('historialService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('lista el historial inicial cuando no hay datos guardados', () => {
    expect(listarHistorial().length).toBe(historialInicial.length);
  });

  it('filtra el historial por los ids de mascota indicados', () => {
    const id = Number(historialInicial[0].mascotaId);
    const lista = listarHistorialDeMascotas([id]);
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((h) => Number(h.mascotaId) === id)).toBeTrue();
    expect(listarHistorialDeMascotas([]).length).toBe(0);
  });

  it('crea un registro con id nuevo, mascotaId numérico y lo agrega al inicio', () => {
    const maxId = Math.max(0, ...historialInicial.map((h) => h.id));
    const nuevo = crearRegistroHistorial({ mascotaId: '3', motivo: 'Control' });
    expect(nuevo.id).toBe(maxId + 1);
    expect(nuevo.mascotaId).toBe(3);
    expect(listarHistorial()[0]).toEqual(nuevo);
    expect(listarHistorial().length).toBe(historialInicial.length + 1);
  });

  it('guarda en localStorage con la clave vsm_historial (mock)', () => {
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough();
    crearRegistroHistorial({ mascotaId: 1, motivo: 'Control' });
    expect(espia).toHaveBeenCalledWith('vsm_historial', jasmine.any(String));
  });

  it('usa los datos iniciales si localStorage falla (mock)', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('sin acceso');
    expect(listarHistorial().length).toBe(historialInicial.length);
  });

  it('entrega una copia de los medicamentos, sin exponer el original', () => {
    const lista = listarMedicamentos();
    lista.push({ codigo: 'FALSO' });
    expect(listarMedicamentos().length).toBe(medicamentos.length);
  });

  it('busca un medicamento por código y devuelve null si no existe', () => {
    expect(obtenerMedicamento(medicamentos[0].codigo)).toEqual(medicamentos[0]);
    expect(obtenerMedicamento('NO-EXISTE')).toBeNull();
  });
});