const API_URL = 'http://localhost:8080/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('vsm_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('vsm_token');
    localStorage.removeItem('vsm_usuario');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada o credenciales inválidas.');
  }

  if (!response.ok) {
    let mensaje = `Error ${response.status}`;
    try {
      const errorData = await response.json();
      mensaje = errorData.message || errorData.error || mensaje;
    } catch {
      // Si no viene JSON de error, mantenemos el código HTTP
    }
    throw new Error(mensaje);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}