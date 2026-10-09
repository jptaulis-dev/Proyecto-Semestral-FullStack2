import { render, screen } from '@testing-library/react';
import EstadoBadge from '../components/EstadoBadge';

describe('EstadoBadge', () => {
  it('muestra el texto legible del estado', () => {
    render(<EstadoBadge estado="CONFIRMADA" />);
    expect(screen.getByText('Confirmada')).toBeTruthy();
  });

  it('no muestra texto de otro estado', () => {
    render(<EstadoBadge estado="CONFIRMADA" />);
    expect(screen.queryByText('Pendiente')).toBeNull();
  });
});