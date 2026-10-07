import { Badge } from 'react-bootstrap';

const COLORES = { PENDIENTE: 'warning', CONFIRMADA: 'success', REAGENDADA: 'info', CANCELADA: 'secondary' };
const TEXTO = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', REAGENDADA: 'Reagendada', CANCELADA: 'Cancelada' };

export default function EstadoBadge({ estado }) {
  return (
    <Badge bg={COLORES[estado] ?? 'secondary'} text={estado === 'PENDIENTE' ? 'dark' : undefined}>
      {TEXTO[estado] ?? estado}
    </Badge>
  );
}
