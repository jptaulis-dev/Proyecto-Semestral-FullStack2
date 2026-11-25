package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Historial;
import cl.duoc.veterinaria_backend.repository.HistorialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class HistorialService {

    private final HistorialRepository repository;

    public HistorialService(HistorialRepository repository) {
        this.repository = repository;
    }

    public List<Historial> listar() {
        return repository.findAll();
    }

    public Historial buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Historial no encontrado"));
    }

    public Historial crear(Historial historial) {
        historial.setId(null);
        if (historial.getVeterinario() == null) historial.setVeterinario("");
        if (historial.getTipo() == null || historial.getTipo().isBlank()) historial.setTipo("Consulta general");
        if (historial.getTratamiento() == null) historial.setTratamiento("");
        if (historial.getObservaciones() == null) historial.setObservaciones("");
        return repository.save(historial);
    }

    public Historial actualizar(Long id, Historial cambios) {
        Historial actual = buscar(id);
        actual.setMascotaId(cambios.getMascotaId());
        actual.setFecha(cambios.getFecha());
        actual.setVeterinario(cambios.getVeterinario() != null ? cambios.getVeterinario() : actual.getVeterinario());
        actual.setTipo(cambios.getTipo() != null ? cambios.getTipo() : actual.getTipo());
        actual.setDiagnostico(cambios.getDiagnostico());
        actual.setTratamiento(cambios.getTratamiento() != null ? cambios.getTratamiento() : actual.getTratamiento());
        actual.setMedicamentoCodigo(cambios.getMedicamentoCodigo());
        actual.setProximoControl(cambios.getProximoControl());
        actual.setObservaciones(cambios.getObservaciones() != null ? cambios.getObservaciones() : actual.getObservaciones());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        repository.delete(buscar(id));
    }
}
