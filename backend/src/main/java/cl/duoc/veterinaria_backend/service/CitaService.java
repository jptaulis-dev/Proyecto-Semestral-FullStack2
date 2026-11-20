package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Cita;
import cl.duoc.veterinaria_backend.repository.CitaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CitaService {

    private final CitaRepository repository;

    public CitaService(CitaRepository repository) {
        this.repository = repository;
    }

    public List<Cita> listar() {
        return repository.findAll();
    }

    public Cita buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Cita no encontrada"));
    }

    public Cita crear(Cita cita) {
        cita.setId(null);
        if (cita.getEstado() == null || cita.getEstado().isBlank()) {
            cita.setEstado("pendiente");
        } else {
            cita.setEstado(cita.getEstado().trim().toLowerCase());
        }
        return repository.save(cita);
    }

    public Cita actualizar(Long id, Cita cambios) {
        Cita actual = buscar(id);
        if (cambios.getMascotaId() != null) actual.setMascotaId(cambios.getMascotaId());
        if (cambios.getDuenoId() != null) actual.setDuenoId(cambios.getDuenoId());
        if (cambios.getServicioCodigo() != null) actual.setServicioCodigo(cambios.getServicioCodigo());
        if (cambios.getFecha() != null) actual.setFecha(cambios.getFecha());
        if (cambios.getHora() != null) actual.setHora(cambios.getHora());
        if (cambios.getMotivo() != null && !cambios.getMotivo().isBlank()) actual.setMotivo(cambios.getMotivo());
        if (cambios.getEstado() != null && !cambios.getEstado().isBlank()) {
            actual.setEstado(cambios.getEstado().trim().toLowerCase());
        }
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        repository.delete(buscar(id));
    }
}