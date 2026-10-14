import { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export const USUARIOS_DEMO = [
  { id: 1, nombre: 'Juan Pablo ', email: 'admin@juanpablo.cl', rol: ROLES.ADMIN },
  { id: 2, nombre: 'Marcela Soto', email: 'recepcion@sanmarcos.cl', rol: ROLES.RECEPCION },
  { id: 3, nombre: 'Alejandro Chandia', email: 'alej.chandia@duocuc.cl', rol: ROLES.DUENO },
];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('vsm_usuario');
    return guardado ? JSON.parse(guardado) : USUARIOS_DEMO[2]; // Inicia como Dueño por defecto
  });

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('vsm_usuario', JSON.stringify(datosUsuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('vsm_usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}