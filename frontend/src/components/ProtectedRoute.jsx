import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sin sesión -> /login. Con sesión pero sin el rol requerido -> /no-autorizado.
export default function ProtectedRoute({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/no-autorizado" replace />;
  return children;
}
