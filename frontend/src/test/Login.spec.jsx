import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import Login from '../pages/Login';

function renderLogin(login = () => {}) {
  spyOn(AuthContext, 'useAuth').and.returnValue({ login });
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Login', () => {
  it('ofrece una opción por cada cuenta demo', () => {
    renderLogin();
    const opciones = screen.getByLabelText('Cuenta').querySelectorAll('option');
    expect(opciones.length).toBe(AuthContext.USUARIOS_DEMO.length + 1); // +1 por el placeholder
  });

  it('no muestra error al cargar la página', () => {
    renderLogin();
    expect(screen.queryByText('Selecciona una cuenta para continuar.')).toBeNull();
  });

  it('muestra un error y no llama a login si no se eligió cuenta', () => {
    const login = jasmine.createSpy('login');
    renderLogin(login);
    fireEvent.click(screen.getByText('Ingresar'));
    expect(screen.getByText('Selecciona una cuenta para continuar.')).toBeTruthy();
    expect(login).not.toHaveBeenCalled();
  });

  it('llama a login con la cuenta elegida y navega al inicio', () => {
    const login = jasmine.createSpy('login');
    renderLogin(login);
    fireEvent.change(screen.getByLabelText('Cuenta'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Ingresar'));
    expect(login).toHaveBeenCalledWith(AuthContext.USUARIOS_DEMO[1]);
    expect(screen.getByText('Pantalla de inicio')).toBeTruthy();
  });
});