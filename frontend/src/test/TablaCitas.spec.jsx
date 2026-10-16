import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import TablaCitas from '../components/citas/TablaCitas';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const CITAS = [
  { id: 1, mascotaNombre: 'Firulais', servicioNombre: 'Consulta general', fecha: '2026-10-20', hora: '10:00', motivo: 'Control', estado: 'confirmada' },
  { id: 2, mascotaNombre: 'Luna', servicioNombre: 'Vacuna triple', fecha: '2026-10-22', hora: '11:30', motivo: 'Refuerzo', estado: 'pendiente' },
];

describe('TablaCitas', () => {
  let contenedor;
  let raiz;

  const montar = (ui) => act(() => { raiz.render(ui); });

  beforeEach(() => {
    contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    contenedor.remove();
  });

  // Renderizado correcto
  it('renderiza una fila por cada cita', () => {
    montar(<TablaCitas citas={CITAS} />);
    expect(contenedor.querySelectorAll('tbody tr').length).toBe(CITAS.length);
    expect(contenedor.textContent).toContain('Firulais');
    expect(contenedor.textContent).toContain('Luna');
  });

  // Renderizado condicional
  it('muestra el mensaje vacío y no la tabla cuando no hay citas', () => {
    montar(<TablaCitas citas={[]} />);
    expect(contenedor.querySelector('table')).toBeNull();
    expect(contenedor.textContent).toContain('No hay citas para mostrar');
  });

  // Props
  it('usa el mensaje vacío recibido por props', () => {
    montar(<TablaCitas citas={[]} mensajeVacio="Sin solicitudes" />);
    expect(contenedor.textContent).toContain('Sin solicitudes');
  });

  it('no muestra la columna Acciones si no recibe renderAcciones', () => {
    montar(<TablaCitas citas={CITAS} />);
    expect(contenedor.textContent).not.toContain('Acciones');
  });

  // Eventos
  it('ejecuta la función recibida al hacer clic en una acción', () => {
    const onCancelar = jasmine.createSpy('onCancelar');
    montar(
      <TablaCitas
        citas={CITAS}
        renderAcciones={(c) => (
          <button type="button" onClick={() => onCancelar(c.id)}>Cancelar</button>
        )}
      />
    );
    const botones = contenedor.querySelectorAll('button');
    expect(botones.length).toBe(CITAS.length);
    act(() => { botones[1].click(); });
    expect(onCancelar).toHaveBeenCalledWith(2);
  });
});