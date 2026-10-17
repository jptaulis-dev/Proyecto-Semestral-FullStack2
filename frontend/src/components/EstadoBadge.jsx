import { Badge } from 'react-bootstrap';

const COLORES = { PENDIENTE: 'warning', CONFIRMADA: 'success', REAGENDADA: 'info', CANCELADA: 'secondary' };
const TEXTO = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', REAGENDADA: 'Reagendada', CANCELADA: 'Cancelada' };

export default function EstadoBadge({ estado }) {
  const clave = estado?.toUpperCase();
  return (
    <Badge bg={COLORES[clave] ?? 'secondary'} text={clave === 'PENDIENTE' ? 'dark' : undefined}>
      {TEXTO[clave] ?? estado}
    </Badge>
  );
}
