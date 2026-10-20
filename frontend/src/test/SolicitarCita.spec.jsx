import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as mascotasService from '../services/mascotasService';
import * as catalogoService from '../services/catalogoService';
import * as citasService from '../services/citasService';
import SolicitarCita from '../pages/dueno/SolicitarCita';

const mascotas = [
  { id: 1, nombre: 'Firulais', especie: 'perro' },
  { id: 2, nombre: 'Luna', especie: 'gato' },
];
const servicio = { codigo: 'CON', categoria: 'Consulta', nombre: 'General', duracionMin: 30, precio: 15000, observaciones: '' };

function renderSolicitar({ dueno = { id: 1 }, citasExistentes = [] } = {}) {
  spyOn(AuthContext, 'useAuth').and.returnValue({ usuario: { id: 10 } });
  spyOn(mascotasService, 'obtenerDuenoPorUsuario').and.returnValue(dueno);
  spyOn(mascotasService, 'listarMascotasDeDueno').and.returnValue(mascotas);
  spyOn(mascotasService, 'obtenerMascota').and.callFake((id) => mascotas.find((m) => m.id === id) || null);
  spyOn(catalogoService, 'serviciosParaMascota').and.returnValue([servicio]);
  spyOn(catalogoService, 'obtenerServicio').and.returnValue(servicio);
  spyOn(citasService, 'listarCitas').and.returnValue(citasExistentes);
  spyOn(citasService, 'crearCita');
  return render(
    <MemoryRouter initialEntries={['/citas/nueva']}>
      <Routes>
        <Route path="/citas/nueva" element={<SolicitarCita />} />
        <Route path="/mis-citas" element={<p>Pantalla mis citas</p>} />
      </Routes>
    </MemoryRouter>
  );
}

const cambiar = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

function completarFormulario() {
  cambiar('Mascota', '1');
  cambiar('Servicio', 'CON');
  cambiar('Fecha', '2999-01-01');
  cambiar('Hora', '10:00');
  cambiar('Motivo de la consulta', 'Control anual');
}

describe('SolicitarCita (página)', () => {
  it('avisa si el usuario no tiene ficha de dueño', () => {
    renderSolicitar({ dueno: null });
    expect(screen.getByText('No se encontró tu ficha de dueño.')).toBeTruthy();
  });

  it('el servicio está deshabilitado hasta elegir una mascota', () => {
    renderSolicitar();
    expect(screen.getByLabelText('Servicio').disabled).toBeTrue();
    cambiar('Mascota', '1');
    expect(screen.getByLabelText('Servicio').disabled).toBeFalse();
    expect(screen.getByText('Consulta - General')).toBeTruthy();
  });

  it('muestra la duración del servicio elegido', () => {
    renderSolicitar();
    cambiar('Mascota', '1');
    cambiar('Servicio', 'CON');
    expect(screen.getByText(/Duración aprox\.: 30 min/)).toBeTruthy();
  });

  it('reinicia el servicio al cambiar de mascota', () => {
    renderSolicitar();
    cambiar('Mascota', '1');
    cambiar('Servicio', 'CON');
    expect(screen.getByLabelText('Servicio').value).toBe('CON');
    cambiar('Mascota', '2');
    expect(screen.getByLabelText('Servicio').value).toBe('');
  });

  it('muestra los errores de validación y no crea la cita con el formulario vacío', () => {
    renderSolicitar();
    fireEvent.click(screen.getByText('Enviar solicitud'));
    expect(screen.getByText('Selecciona una mascota')).toBeTruthy();
    expect(screen.getByText('Selecciona un servicio')).toBeTruthy();
    expect(screen.getByText('Selecciona una fecha')).toBeTruthy();
    expect(screen.getByText('Selecciona una hora')).toBeTruthy();
    expect(screen.getByText('Describe el motivo (mínimo 5 caracteres)')).toBeTruthy();
    expect(citasService.crearCita).not.toHaveBeenCalled();
  });

  it('rechaza una fecha anterior a hoy', () => {
    renderSolicitar();
    cambiar('Fecha', '2000-01-01');
    fireEvent.click(screen.getByText('Enviar solicitud'));
    expect(screen.getByText('La fecha no puede ser anterior a hoy')).toBeTruthy();
  });

  it('rechaza un horario ya ocupado', () => {
    renderSolicitar({
      citasExistentes: [{ id: 9, fecha: '2999-01-01', hora: '10:00', estado: 'confirmada' }],
    });
    completarFormulario();
    fireEvent.click(screen.getByText('Enviar solicitud'));
    expect(screen.getByText('Ese horario ya está ocupado, elige otro')).toBeTruthy();
    expect(citasService.crearCita).not.toHaveBeenCalled();
  });

  it('crea la cita con los datos del formulario y navega a Mis citas', () => {
    renderSolicitar();
    completarFormulario();
    fireEvent.click(screen.getByText('Enviar solicitud'));
    expect(citasService.crearCita).toHaveBeenCalledWith({
      mascotaId: 1,
      duenoId: 1,
      servicioCodigo: 'CON',
      fecha: '2999-01-01',
      hora: '10:00',
      motivo: 'Control anual',
    });
    expect(screen.getByText('Pantalla mis citas')).toBeTruthy();
  });
});