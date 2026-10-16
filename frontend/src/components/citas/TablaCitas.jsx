import EstadoBadge from '../EstadoBadge';

export default function TablaCitas({
  citas,
  renderAcciones,
  mensajeVacio = 'No hay citas para mostrar',
}) {
  if (citas.length === 0) {
    return <p className="text-muted" role="status">{mensajeVacio}</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Mascota</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Estado</th>
            {renderAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.mascotaNombre}</td>
              <td>{c.servicioNombre}</td>
              <td>{c.fecha}</td>
              <td>{c.hora}</td>
              <td>{c.motivo}</td>
              <td><EstadoBadge estado={c.estado} /></td>
              {renderAcciones && <td>{renderAcciones(c)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}