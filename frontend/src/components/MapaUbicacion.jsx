import { useState } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapaUbicacion() {
  const posicionClinica = [-34.1708, -70.7444]; // Centro de Rancagua
  const direccionExacta = 'Av. Libertador Bernardo O’Higgins 450, Rancagua, Región de O’Higgins';
  const [errorGeo, setErrorGeo] = useState('');

  const obtenerIndicaciones = () => {
    setErrorGeo('');
    if (!navigator.geolocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${posicionClinica[0]},${posicionClinica[1]}`,
        '_blank'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${posicionClinica[0]},${posicionClinica[1]}&travelmode=driving`;
        window.open(url, '_blank');
      },
      () => {
        setErrorGeo('No pudimos obtener tu GPS actual, abriendo ruta directa a la clínica...');
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${posicionClinica[0]},${posicionClinica[1]}`,
          '_blank'
        );
      }
    );
  };

  return (
    <div className="my-4">
      <h2 className="mb-3">📍 Cómo llegar a Veterinaria San Marcos</h2>
      {errorGeo && <Alert variant="warning">{errorGeo}</Alert>}

      <Row className="g-4">
        <Col xs={12} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <Card.Title className="fw-bold text-primary mb-3">
                  Información de la Clínica
                </Card.Title>
                <p className="mb-2">
                  <strong>Dirección:</strong> <br />
                  {direccionExacta}
                </p>
                <p className="mb-2">
                  <strong>Horario de Atención:</strong> <br />
                  Lunes a Sábado: 09:00 a 19:00 hrs.
                </p>
                <p className="mb-2">
                  <strong>Servicios:</strong> <br />
                  Consulta general, vacunación, cirugía menor, desparasitación y control de peso.
                </p>
                <p className="mb-3">
                  <strong>Teléfono Recepción:</strong> <br />
                  +56 72 234 5678
                </p>
              </div>

              <Button variant="success" className="w-100 mt-3" onClick={obtenerIndicaciones}>
                🚗 Obtener indicaciones desde mi ubicación
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={8}>
          <div style={{ height: '420px', width: '100%', borderRadius: '10px', overflow: 'hidden' }} className="shadow-sm border">
            <MapContainer center={posicionClinica} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={posicionClinica}>
                <Popup>
                  <strong>Veterinaria San Marcos</strong> <br />
                  {direccionExacta}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}