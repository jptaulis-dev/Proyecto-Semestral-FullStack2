import { render, screen, fireEvent } from '@testing-library/react';
import * as citasService from '../services/citasService';
import * as mascotasService from '../services/mascotasService';
import * as catalogoService from '../services/catalogoService';
import SolicitudesPendientes from '../pages/recepcion/SolicitudesPendientes';

// id 1 y 3 pendientes (la 3 es anterior), id 2 confirmada
const citas = [
  { id: 1, mascotaId: 1, servicioCodigo: 'CON', fecha: '2030-01-10', hora: '10:00', motivo: 'Control', estado: 'pendiente' },
  { id: 2, mascotaId: 2, servicioCodigo: 'CON', fecha: '2030-01-11', hora: '11:00', motivo: 'Vacuna', estado: 'confirmada' },
  { id: 3, mascotaId: 1, servicioCodigo: 'CON', fecha: '2030-01-05', hora: '09:00', motivo: 'Dolor', estado: 'pendiente' },
];

function renderPendientes(lista = citas) {
  spyOn(citasService, 'listarCitas').and.returnValue(lista);
  spyOn(citasService, 'actualizarCita');
  spyOn(mascotasService, 'obtenerMascota').and.returnValue({ nombre: 'Firulais' });
  spyOn(catalogoService, 'obtenerServicio').and.returnValue({ nombre: 'Consulta' });
  return render(<SolicitudesPendientes />);
}

describe('SolicitudesPendientes (página)', () => {
  it('muestra solo las citas pendientes', () => {
    renderPendientes();
    expect(screen.getAllByText('Confirmar').length).toBe(2);
    expect(screen.getAllByText('Rechazar').length).toBe(2);
  });

  it('muestra un mensaje cuando no hay solicitudes pendientes', () => {
    renderPendientes([citas[1]]);
    expect(screen.getByText('No hay solicitudes pendientes.')).toBeTruthy();
    expect(screen.queryByText('Confirmar')).toBeNull();
  });

  it('confirmar actúa sobre la solicitud más antigua primero', () => {
    renderPendientes();
    fireEvent.click(screen.getAllByText('Confirmar')[0]);
    expect(citasService.actualizarCita).toHaveBeenCalledWith(3, { estado: 'confirmada' });
    expect(screen.getByText('Cita confirmada')).toBeTruthy();
  });

  it('rechazar cancela la solicitud y muestra el aviso', () => {
    renderPendientes();
    fireEvent.click(screen.getAllByText('Rechazar')[0]);
    expect(citasService.actualizarCita).toHaveBeenCalledWith(3, { estado: 'cancelada' });
    expect(screen.getByText('Cita rechazada')).toBeTruthy();
  });

  it('reagendar abre el formulario y guarda el nuevo horario', () => {
    renderPendientes();
    fireEvent.click(screen.getAllByText('Reagendar')[0]);
    fireEvent.click(screen.getByText('Guardar'));
    expect(citasService.actualizarCita).toHaveBeenCalledWith(3, {
      fecha: '2030-01-05',
      hora: '09:00',
      estado: 'reagendada',
    });
    expect(screen.getByText('Cita reagendada')).toBeTruthy();
  });
});