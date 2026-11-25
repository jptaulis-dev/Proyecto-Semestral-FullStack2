import { createContext, useContext, useState } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('vsm_usuario');
    const token = localStorage.getItem('vsm_token');
    return guardado && token ? JSON.parse(guardado) : null;
  });

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const userData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      };

      localStorage.setItem('vsm_token', data.token);
      localStorage.setItem('vsm_usuario', JSON.stringify(userData));
      setUsuario(userData);
      return { exito: true };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message || 'Correo electrónico o contraseña incorrectos.',
      };
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('vsm_token');
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