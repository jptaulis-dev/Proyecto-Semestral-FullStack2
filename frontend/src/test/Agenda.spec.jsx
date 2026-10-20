import { render, screen, fireEvent } from '@testing-library/react';
import * as citasService from '../services/citasService';
import * as mascotasService from '../services/mascotasService';
import * as catalogoService from '../services/catalogoService';
import Agenda from '../pages/recepcion/Agenda';

// id 1: pendiente (Firulais) | id 2: confirmada (Luna) | id 3: cancelada (Firulais)
const citas = [
  { id: 1, mascotaId: 1, servicioCodigo: 'CON', fecha: '2030-01-10', hora: '10:00', motivo: 'Control anual', estado: 'pendiente' },
  { id: 2, mascotaId: 2, servicioCodigo: 'CON', fecha: '2030-01-11', hora: '11:00', motivo: 'Vacuna', estado: 'confirmada' },
  { id: 3, mascotaId: 1, servicioCodigo: 'CON', fecha: '2030-01-12', hora: '12:00', motivo: 'Dolor', estado: 'cancelada' },
];

const cuenta = (texto) => screen.queryAllByText(texto).length;

function renderAgenda() {
  spyOn(citasService, 'listarCitas').and.returnValue(citas);
  spyOn(citasService, 'actualizarCita');
  spyOn(mascotasService, 'obtenerMascota').and.callFake((id) => ({ nombre: id === 1 ? 'Firulais' : 'Luna' }));
  spyOn(catalogoService, 'obtenerServicio').and.returnValue({ nombre: 'Consulta' });
  return render(<Agenda />);
}

describe('Agenda (página)', () => {
  it('muestra las acciones según el estado de cada cita', () => {
    renderAgenda();
    expect(cuenta('Confirmar')).toBe(1);   // solo la pendiente
    expect(cuenta('Reagendar')).toBe(2);   // pendiente y confirmada
    expect(cuenta('Cancelar')).toBe(2);    // la cancelada no tiene acciones
  });

  it('filtra por estado', () => {
    renderAgenda();
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'confirmada' } });
    expect(cuenta('Confirmar')).toBe(0);
    expect(cuenta('Reagendar')).toBe(1);
  });

  it('filtra por fecha', () => {
    renderAgenda();
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2030-01-11' } });
    expect(cuenta('Confirmar')).toBe(0);
    expect(cuenta('Reagendar')).toBe(1);
  });

  it('filtra por el nombre de la mascota', () => {
    renderAgenda();
    fireEvent.change(screen.getByPlaceholderText('Ej: Firulais, Vacuna, Control...'), {
      target: { value: 'luna' },
    });
    expect(cuenta('Confirmar')).toBe(0);
    expect(cuenta('Reagendar')).toBe(1);
  });

  it('muestra un mensaje cuando ninguna cita coincide con los filtros', () => {
    renderAgenda();
    fireEvent.change(screen.getByPlaceholderText('Ej: Firulais, Vacuna, Control...'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('No se encontraron citas con los filtros seleccionados.')).toBeTruthy();
  });

  it('Limpiar restablece los filtros', () => {
    renderAgenda();
    fireEvent.change(screen.getByPlaceholderText('Ej: Firulais, Vacuna, Control...'), {
      target: { value: 'zzz' },
    });
    fireEvent.click(screen.getByText('Limpiar'));
    expect(screen.queryByText('No se encontraron citas con los filtros seleccionados.')).toBeNull();
    expect(cuenta('Confirmar')).toBe(1);
  });

  it('confirmar actualiza la cita y muestra el aviso', () => {
    renderAgenda();
    fireEvent.click(screen.getByText('Confirmar'));
    expect(citasService.actualizarCita).toHaveBeenCalledWith(1, { estado: 'confirmada' });
    expect(screen.getByText('Cita confirmada')).toBeTruthy();
  });

  it('cancelar actualiza la primera cita de la lista y muestra el aviso', () => {
    renderAgenda();
    fireEvent.click(screen.getAllByText('Cancelar')[0]);
    expect(citasService.actualizarCita).toHaveBeenCalledWith(1, { estado: 'cancelada' });
    expect(screen.getByText('Cita cancelada')).toBeTruthy();
  });

  it('reagendar abre el formulario y guarda fecha, hora y estado reagendada', () => {
    renderAgenda();
    fireEvent.click(screen.getAllByText('Reagendar')[0]);
    expect(screen.getByLabelText('Nueva fecha')).toBeTruthy();

    fireEvent.click(screen.getByText('Guardar'));
    expect(citasService.actualizarCita).toHaveBeenCalledWith(1, {
      fecha: '2030-01-10',
      hora: '10:00',
      estado: 'reagendada',
    });
    expect(screen.getByText('Cita reagendada correctamente')).toBeTruthy();
  });
});