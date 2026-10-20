import { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

// Agregamos la propiedad 'password' a los usuarios de prueba
export const USUARIOS_DEMO = [
  { id: 1, nombre: 'Juan Pablo', email: 'admin@juanpablo.cl', password: 'password123', rol: ROLES.ADMIN },
  { id: 2, nombre: 'Marcela Soto', email: 'recepcion@sanmarcos.cl', password: 'password123', rol: ROLES.RECEPCION },
  { id: 3, nombre: 'Alejandro Chandia', email: 'alej.chandia@duocuc.cl', password: 'password123', rol: ROLES.DUENO },
];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('vsm_usuario');
    // Empezamos como null para forzar que pase por la pantalla de Login
    return guardado ? JSON.parse(guardado) : null; 
  });

  // Nueva lógica que valida correo y contraseña
  const login = (email, password) => {
    const userEncontrado = USUARIOS_DEMO.find(
      (u) => u.email === email && u.password === password
    );
    
    if (userEncontrado) {
      setUsuario(userEncontrado);
      localStorage.setItem('vsm_usuario', JSON.stringify(userEncontrado));
      return { exito: true };
    } else {
      return { exito: false, mensaje: 'Correo electrónico o contraseña incorrectos.' };
    }
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