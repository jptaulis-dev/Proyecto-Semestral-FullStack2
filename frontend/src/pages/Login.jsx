import { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Hacia dónde redirigir después de loguearse exitosamente
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación 1: Campos vacíos
    if (!email.trim() || !password.trim()) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    // Validación 2: Credenciales correctas
    const resultado = login(email, password);
    if (resultado.exito) {
      navigate(from, { replace: true });
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-lg p-4 border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold">🐾 San Marcos</h2>
          <p className="text-muted">Acceso al Sistema Veterinario</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="fw-bold">Correo electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="ejemplo@correo.cl" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label className="fw-bold">Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Ingresa tu clave" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold py-2">
            Iniciar Sesión
          </Button>
        </Form>

        <div className="mt-4 p-3 bg-light rounded text-muted small">
          <p className="mb-2 text-dark"><strong>Cuentas de prueba (Clave: password123)</strong></p>
          <ul className="mb-0 ps-3">
            <li><strong>Admin:</strong> admin@juanpablo.cl</li>
            <li><strong>Recepción:</strong> recepcion@sanmarcos.cl</li>
            <li><strong>Dueño:</strong> alej.chandia@duocuc.cl</li>
          </ul>
        </div>
      </Card>
    </Container>
  );
}