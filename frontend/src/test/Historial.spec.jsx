import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as mascotasService from '../services/mascotasService';
import * as historialService from '../services/historialService';
import { ROLES } from '../constants/roles';
import Historial from '../pages/Historial';

const mockMascotas = [{ id: 1, nombre: 'Firulais', especie: 'perro' }];
const mockRegistros = [
  { id: 1, mascotaId: 1, tipo: 'Vacunación', veterinario: 'Dr. A', diagnostico: 'Sano', medicamentoCodigo: 'ME001', proximoControl: '2026-11-10', fecha: '2026-10-01' }
];

function renderHistorial() {
  spyOn(AuthContext, 'useAuth').and.returnValue({ usuario: { id: 1, rol: ROLES.ADMIN } });
  spyOn(mascotasService, 'listarMascotas').and.returnValue(mockMascotas);
  spyOn(mascotasService, 'obtenerMascota').and.returnValue(mockMascotas[0]);
  spyOn(historialService, 'listarHistorial').and.returnValue(mockRegistros);
  spyOn(historialService, 'listarMedicamentos').and.returnValue([{ codigo: 'ME001', nombre: 'Amoxibay', stock: 10 }]);
  spyOn(historialService, 'obtenerMedicamento').and.returnValue({ nombre: 'Amoxibay', principio: 'Amoxicilina' });
  spyOn(historialService, 'crearRegistroHistorial').and.returnValue({});
  return render(<MemoryRouter><Historial /></MemoryRouter>);
}

describe('Historial Clínico (página)', () => {
  it('renderiza la vista y despliega recordatorios de vacunas próximas', () => {
    renderHistorial();
    expect(screen.getByText('📋 Historial Clínico y Carnet de Vacunación')).toBeTruthy();
    expect(screen.getByText(/Recordatorio de próximos controles/i)).toBeTruthy();
  });

  it('muestra error si el formulario se envía incompleto', () => {
    renderHistorial();
    fireEvent.click(screen.getByText('Guardar en Ficha Digital'));
    expect(screen.getByText('Ingresa el diagnóstico y tratamiento (mínimo 10 caracteres)')).toBeTruthy();
  });

  it('filtra los registros al cambiar el tipo de atención', () => {
    renderHistorial();
    // Buscamos el segundo combobox de la pantalla (el filtro de tipo)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Cirugía menor' } });
    
    expect(screen.getByText('No existen registros clínicos para el filtro seleccionado.')).toBeTruthy();
  });
});