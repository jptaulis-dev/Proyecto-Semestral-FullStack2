import MapaUbicacion from './components/MapaUbicacion';

export default function App() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">¡Veterinaria San Marcos! 🐾</h1>
      <p className="mb-4">El motor de React ya está encendido y funcionando perfectamente.</p>
      
      <h3>¿Dónde estamos?</h3>
      {/* Aquí llamamos a tu nuevo componente de mapa */}
      <MapaUbicacion />
      
    </div>
  );
}