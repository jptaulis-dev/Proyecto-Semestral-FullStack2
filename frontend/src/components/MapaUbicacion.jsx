import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglo para que el ícono de Leaflet se vea bien en Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapaUbicacion() {
  // Coordenadas aproximadas del centro de Rancagua
  const posicionRancagua = [-34.1708, -70.7444];

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
      <MapContainer 
        center={posicionRancagua} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={posicionRancagua}>
          <Popup>
            <strong>Veterinaria San Marcos</strong> <br />
            ¡Te esperamos aquí en Rancagua!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}