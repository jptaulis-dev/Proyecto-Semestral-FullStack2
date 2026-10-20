import { render, screen, fireEvent } from '@testing-library/react';
import * as citasService from '../services/citasService';
import { HORAS, hoy } from '../utils/horarios';
import FormReagendar from '../components/citas/FormReagendar';

const cita = { id: 1, fecha: hoy(), hora: HORAS[0], estado: 'pendiente' };

function renderForm() {
  const props = {
    cita,
    onGuardar: jasmine.createSpy('onGuardar'),
    onCancelar: jasmine.createSpy('onCancelar'),
  };
  render(<FormReagendar {...props} />);
  return props;
}

describe('FormReagendar', () => {
  beforeEach(() => {
    // Mock: la lista de citas existentes se controla en cada prueba
    spyOn(citasService, 'listarCitas').and.returnValue([]);
  });

  it('muestra la fecha y hora de la cita recibida por props', () => {
    renderForm();
    expect(screen.getByLabelText('Nueva fecha').value).toBe(cita.fecha);
    expect(screen.getByLabelText('Nueva hora').value).toBe(cita.hora);
  });

  it('no muestra errores al cargar', () => {
    renderForm();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('llama a onGuardar con la fecha y hora si no hay conflicto', () => {
    const props = renderForm();
    fireEvent.click(screen.getByText('Guardar'));
    expect(props.onGuardar).toHaveBeenCalledWith({ fecha: cita.fecha, hora: cita.hora });
  });

  it('rechaza una fecha pasada y no llama a onGuardar', () => {
    const props = renderForm();
    fireEvent.change(screen.getByLabelText('Nueva fecha'), { target: { value: '2000-01-01' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByRole('alert').textContent).toBe('Elige una fecha válida (hoy o posterior)');
    expect(props.onGuardar).not.toHaveBeenCalled();
  });

  it('rechaza un horario ocupado por otra cita', () => {
    citasService.listarCitas.and.returnValue([
      { id: 99, fecha: cita.fecha, hora: cita.hora, estado: 'confirmada' },
    ]);
    const props = renderForm();
    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByRole('alert').textContent).toBe('Ese horario ya está ocupado');
    expect(props.onGuardar).not.toHaveBeenCalled();
  });

  it('ignora las citas canceladas y la propia cita al revisar conflictos', () => {
    citasService.listarCitas.and.returnValue([
      { id: 99, fecha: cita.fecha, hora: cita.hora, estado: 'cancelada' },
      { id: cita.id, fecha: cita.fecha, hora: cita.hora, estado: 'pendiente' },
    ]);
    const props = renderForm();
    fireEvent.click(screen.getByText('Guardar'));
    expect(props.onGuardar).toHaveBeenCalledTimes(1);
  });

  it('limpia el error al cambiar la fecha y llama a onCancelar', () => {
    const props = renderForm();
    fireEvent.change(screen.getByLabelText('Nueva fecha'), { target: { value: '2000-01-01' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByRole('alert')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nueva fecha'), { target: { value: cita.fecha } });
    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(screen.getByText('Cancelar'));
    expect(props.onCancelar).toHaveBeenCalledTimes(1);
  });
});