import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as mascotasService from '../services/mascotasService';
import * as citasService from '../services/citasService';
import * as catalogoService from '../services/catalogoService';
import MisCitas from '../pages/dueno/MisCitas';

const base = { mascotaId: 1, servicioCodigo: 'CON', hora: '10:00', motivo: 'Control' };
const citas = [
  { ...base, id: 1, fecha: '2030-01-10', estado: 'pendiente' },
  { ...base, id: 2, fecha: '2030-01-11', estado: 'confirmada' },
  { ...base, id: 3, fecha: '2030-01-12', estado: 'reagendada' },
  { ...base, id: 4, fecha: '2030-01-13', estado: 'cancelada' },
];

function renderMisCitas({ dueno = { id: 1 }, lista = citas } = {}) {
  spyOn(AuthContext, 'useAuth').and.returnValue({ usuario: { id: 10 } });
  spyOn(mascotasService, 'obtenerDuenoPorUsuario').and.returnValue(dueno);
  spyOn(mascotasService, 'obtenerMascota').and.returnValue({ nombre: 'Firulais' });
  spyOn(catalogoService, 'obtenerServicio').and.returnValue({ nombre: 'Consulta' });
  spyOn(citasService, 'listarCitasDeDueno').and.returnValue(lista);
  spyOn(citasService, 'actualizarCita');
  return render(
    <MemoryRouter>
      <MisCitas />
    </MemoryRouter>
  );
}

describe('MisCitas (página)', () => {
  it('avisa si el usuario no tiene ficha de dueño', () => {
    renderMisCitas({ dueno: null });
    expect(screen.getByText('No se encontró tu ficha de dueño.')).toBeTruthy();
  });

  it('pide las citas del dueño correcto', () => {
    renderMisCitas();
    expect(mascotasService.obtenerDuenoPorUsuario).toHaveBeenCalledWith(10);
    expect(citasService.listarCitasDeDueno).toHaveBeenCalledWith(1);
  });

  it('tiene un enlace para solicitar una cita nueva', () => {
    renderMisCitas();
    const enlace = screen.getByText('Solicitar cita').closest('a');
    expect(enlace.getAttribute('href')).toBe('/citas/nueva');
  });

  it('muestra un mensaje cuando el dueño no tiene citas', () => {
    renderMisCitas({ lista: [] });
    expect(screen.getByText('Aún no tienes citas. ¡Solicita la primera!')).toBeTruthy();
  });

  it('solo permite cancelar las citas pendientes, confirmadas o reagendadas', () => {
    renderMisCitas();
    expect(screen.getAllByText('Cancelar').length).toBe(3);
  });

  it('cancela la cita solo si el usuario confirma', () => {
    renderMisCitas();
    const confirmar = spyOn(window, 'confirm').and.returnValue(false);

    fireEvent.click(screen.getAllByText('Cancelar')[0]);
    expect(citasService.actualizarCita).not.toHaveBeenCalled();

    confirmar.and.returnValue(true);
    fireEvent.click(screen.getAllByText('Cancelar')[0]);
    expect(citasService.actualizarCita).toHaveBeenCalledWith(1, { estado: 'cancelada' });
  });
});