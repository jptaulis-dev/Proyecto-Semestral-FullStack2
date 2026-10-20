import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  alternarEstadoUsuario,
} from '../services/usuariosService';
import { usuariosIniciales } from '../data/usuarios';

describe('usuariosService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('lista los usuarios iniciales cuando no hay datos guardados', () => {
    expect(listarUsuarios().length).toBe(usuariosIniciales.length);
  });

  it('crea un usuario activo con id nuevo', () => {
    const maxId = Math.max(0, ...usuariosIniciales.map((u) => u.id));
    const nuevo = crearUsuario({ nombre: 'Prueba', email: 'prueba@correo.cl', rol: 'RECEPCIONISTA' });
    expect(nuevo.id).toBe(maxId + 1);
    expect(nuevo.activo).toBeTrue();
    expect(listarUsuarios().length).toBe(usuariosIniciales.length + 1);
  });

  it('actualiza solo el usuario indicado', () => {
    const id = usuariosIniciales[0].id;
    const actualizado = actualizarUsuario(id, { nombre: 'Nombre Nuevo' });
    expect(actualizado.nombre).toBe('Nombre Nuevo');
    if (usuariosIniciales.length > 1) {
      const otro = listarUsuarios().find((u) => u.id === usuariosIniciales[1].id);
      expect(otro).toEqual(usuariosIniciales[1]);
    }
  });

  it('devuelve null al actualizar un usuario que no existe', () => {
    expect(actualizarUsuario(99999, { nombre: 'X' })).toBeNull();
  });

  it('alterna el estado activo y lo restaura al repetir', () => {
    const id = usuariosIniciales[0].id;
    const inicial = !!usuariosIniciales[0].activo;
    expect(alternarEstadoUsuario(id).activo).toBe(!inicial);
    expect(alternarEstadoUsuario(id).activo).toBe(inicial);
  });

  it('guarda en localStorage con la clave vsm_usuarios (mock)', () => {
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough();
    crearUsuario({ nombre: 'Prueba', email: 'p@correo.cl', rol: 'DUENO' });
    expect(espia).toHaveBeenCalledWith('vsm_usuarios', jasmine.any(String));
  });
});