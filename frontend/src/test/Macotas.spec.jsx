import { render, screen, fireEvent } from '@testing-library/react';
import * as AuthContext from '../context/AuthContext';
import * as mascotasService from '../services/mascotasService';
import { ROLES } from '../constants/roles';
import Mascotas from '../pages/Mascotas';

const duenos = [
  { id: 1, nombre: 'Ana Pérez', telefono: '111' },
  { id: 2, nombre: 'Luis Soto', telefono: '222' },
];
const mascotas = [
  { id: 1, duenoId: 1, nombre: 'Firulais', especie: 'perro', sexo: 'macho', fechaNacimiento: '2019-03-20' },
  { id: 2, duenoId: 2, nombre: 'Rocky', especie: 'perro', sexo: 'macho', fechaNacimiento: '2020-11-02' },
  { id: 3, duenoId: 2, nombre: 'Luna', especie: 'gato', sexo: 'hembra', fechaNacimiento: '2021-07-15' },
];

const recepcion = { id: 2, nombre: 'Marcela', rol: ROLES.RECEPCION };
const dueno = { id: 10, nombre: 'Ana', rol: ROLES.DUENO };

function renderMascotas(usuario) {
  spyOn(AuthContext, 'useAuth').and.returnValue({ usuario });
  spyOn(mascotasService, 'listarDuenos').and.returnValue(duenos);
  spyOn(mascotasService, 'obtenerDueno').and.callFake((id) => duenos.find((d) => d.id === Number(id)) || null);
  spyOn(mascotasService, 'obtenerDuenoPorUsuario').and.callFake((uid) => (uid === 10 ? duenos[0] : null));
  spyOn(mascotasService, 'listarMascotas').and.returnValue(mascotas);
  spyOn(mascotasService, 'listarMascotasDeDueno').and.callFake((id) =>
    mascotas.filter((m) => m.duenoId === Number(id))
  );
  spyOn(mascotasService, 'crearMascota').and.returnValue({});
  spyOn(mascotasService, 'actualizarMascota').and.returnValue({});
  return render(<Mascotas />);
}

describe('Mascotas (página)', () => {
  it('el personal de la clínica ve todas las mascotas, la columna Dueño y el formulario', () => {
    renderMascotas(recepcion);
    expect(screen.getByText('Firulais')).toBeTruthy();
    expect(screen.getByText('Rocky')).toBeTruthy();
    expect(screen.getByText('Luna')).toBeTruthy();
    expect(screen.getByText('Dueño')).toBeTruthy();
    expect(screen.getByText('Registrar Mascota')).toBeTruthy();
  });

  it('el dueño solo ve sus mascotas y no ve acciones ni formulario', () => {
    renderMascotas(dueno);
    expect(mascotasService.listarMascotasDeDueno).toHaveBeenCalledWith(1);
    expect(mascotasService.listarMascotas).not.toHaveBeenCalled();
    expect(screen.getByText('Firulais')).toBeTruthy();
    expect(screen.queryByText('Rocky')).toBeNull();
    expect(screen.queryByText('Acciones')).toBeNull();
    expect(screen.queryByText('Registrar Mascota')).toBeNull();
  });

  it('filtra la lista al escribir en el buscador', () => {
    renderMascotas(recepcion);
    fireEvent.change(screen.getByPlaceholderText('Buscar mascota por nombre o especie...'), {
      target: { value: 'gato' },
    });
    expect(screen.getByText('Luna')).toBeTruthy();
    expect(screen.queryByText('Firulais')).toBeNull();
  });

  it('muestra un mensaje cuando la búsqueda no tiene resultados', () => {
    renderMascotas(recepcion);
    fireEvent.change(screen.getByPlaceholderText('Buscar mascota por nombre o especie...'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('No hay mascotas registradas que coincidan con la búsqueda.')).toBeTruthy();
  });

  it('muestra errores de validación y no crea la mascota con datos incompletos', () => {
    renderMascotas(recepcion);
    fireEvent.click(screen.getByText('Registrar Mascota'));
    expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeTruthy();
    expect(screen.getByText('Ingresa la fecha de nacimiento')).toBeTruthy();
    expect(mascotasService.crearMascota).not.toHaveBeenCalled();
  });

  it('rechaza una fecha de nacimiento futura', () => {
    renderMascotas(recepcion);
    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), { target: { value: 'Toby' } });
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: '2999-01-01' } });
    fireEvent.click(screen.getByText('Registrar Mascota'));
    expect(screen.getByText('La fecha no puede ser futura')).toBeTruthy();
    expect(mascotasService.crearMascota).not.toHaveBeenCalled();
  });

  it('crea la mascota con los datos del formulario y muestra la confirmación', () => {
    renderMascotas(recepcion);
    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), { target: { value: 'Toby' } });
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: '2020-05-05' } });
    fireEvent.change(screen.getByLabelText('Dueño responsable'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Registrar Mascota'));
    expect(mascotasService.crearMascota).toHaveBeenCalledWith({
      nombre: 'Toby',
      especie: 'perro',
      sexo: 'macho',
      fechaNacimiento: '2020-05-05',
      duenoId: 2,
    });
    expect(screen.getByText('Nueva mascota registrada en el sistema.')).toBeTruthy();
  });

  it('carga la ficha al editar y actualiza solo esa mascota', () => {
    renderMascotas(recepcion);
    fireEvent.click(screen.getAllByText('Editar')[0]);
    expect(screen.getByText(/Editar Ficha de Paciente/)).toBeTruthy();
    expect(screen.getByLabelText('Nombre de la mascota').value).toBe('Firulais');

    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), { target: { value: 'Firu' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(mascotasService.actualizarMascota).toHaveBeenCalledWith(1, {
      nombre: 'Firu',
      especie: 'perro',
      sexo: 'macho',
      fechaNacimiento: '2019-03-20',
      duenoId: 1,
    });
    expect(screen.getByText('Ficha de mascota actualizada correctamente.')).toBeTruthy();
  });
});