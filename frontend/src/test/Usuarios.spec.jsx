import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as usuariosService from '../services/usuariosService';
import { ROLES } from '../constants/roles';
import Usuarios from '../pages/admin/Usuarios';

const mockUsuarios = [
  { id: 1, nombre: 'Admin Uno', email: 'admin@test.cl', rol: ROLES.ADMIN, activo: true },
  { id: 2, nombre: 'Recepcion Dos', email: 'rec@test.cl', rol: ROLES.RECEPCION, activo: false }
];

function renderUsuarios() {
  spyOn(AuthContext, 'useAuth').and.returnValue({ usuario: mockUsuarios[0] });
  spyOn(usuariosService, 'listarUsuarios').and.returnValue(mockUsuarios);
  spyOn(usuariosService, 'crearUsuario').and.returnValue({});
  spyOn(usuariosService, 'actualizarUsuario').and.returnValue({});
  spyOn(usuariosService, 'alternarEstadoUsuario').and.returnValue({});
  return render(<MemoryRouter><Usuarios /></MemoryRouter>);
}

describe('Panel Usuarios (página)', () => {
  it('renderiza la lista de usuarios correctamente', () => {
    renderUsuarios();
    expect(screen.getByText('Admin Uno')).toBeTruthy();
    expect(screen.getByText('Recepcion Dos')).toBeTruthy();
  });

  it('muestra validaciones al intentar crear un usuario con datos vacíos o erróneos', () => {
    renderUsuarios();
    fireEvent.click(screen.getByText('Crear Usuario'));
    expect(screen.getByText('El nombre debe tener mínimo 3 caracteres')).toBeTruthy();
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeTruthy();
  });

  it('permite buscar usuarios dinámicamente', () => {
    renderUsuarios();
    fireEvent.change(screen.getByPlaceholderText('Buscar usuario por nombre, correo o rol...'), { 
      target: { value: 'Recepcion' } 
    });
    expect(screen.queryByText('Admin Uno')).toBeNull();
    expect(screen.getByText('Recepcion Dos')).toBeTruthy();
  });

  it('carga los datos en el formulario al dar clic en Editar', () => {
    renderUsuarios();
    const btnEditar = screen.getAllByText('Editar')[0];
    fireEvent.click(btnEditar);
    expect(screen.getByDisplayValue('Admin Uno')).toBeTruthy();
    expect(screen.getByText('Guardar Cambios')).toBeTruthy();
  });
});