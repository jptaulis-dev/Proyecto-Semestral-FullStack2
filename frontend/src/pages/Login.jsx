import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth, USUARIOS_DEMO } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [cuentaId, setCuentaId] = useState('');
  const [error, setError] = useState('');

  const ingresar = (e) => {
    e.preventDefault();
    const cuenta = USUARIOS_DEMO.find((u) => String(u.id) === cuentaId);
    if (!cuenta) {
      setError('Selecciona una cuenta para continuar.');
      return;
    }
    setError('');
    login(cuenta);
    navigate('/');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card body>
            <h1 className="h3 mb-3">Iniciar sesión</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={ingresar} noValidate>
              <Form.Group className="mb-3" controlId="cuenta">
                <Form.Label>Cuenta</Form.Label>
                <Form.Select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
                  <option value="">Selecciona una cuenta...</option>
                  {USUARIOS_DEMO.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} ({u.rol})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="w-100">Ingresar</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}