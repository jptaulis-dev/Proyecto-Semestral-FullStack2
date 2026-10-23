import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-success border-4">
      <Container className="text-center">
        <h5 className="text-success fw-bold mb-2">🐾 Veterinaria San Marcos</h5>
        <p className="small text-white-50 mb-0">
          Av. Libertador Bernardo O’Higgins 450, Rancagua.<br/>
          Desarrollado para la Evaluación Parcial 2 - Desarrollo FullStack II.
        </p>
      </Container>
    </footer>
  );
}