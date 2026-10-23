import { render, screen } from '@testing-library/react';
import MapaUbicacion from '../components/MapaUbicacion';

describe('MapaUbicacion (Componente)', () => {
  it('renderiza la información de contacto de la clínica', () => {
    render(<MapaUbicacion />);
    expect(screen.getByText('📍 Cómo llegar a Veterinaria San Marcos')).toBeTruthy();
    expect(screen.getByText('+56 72 234 5678')).toBeTruthy();
    expect(screen.getByText(/Av. Libertador Bernardo/i)).toBeTruthy();
  });
});