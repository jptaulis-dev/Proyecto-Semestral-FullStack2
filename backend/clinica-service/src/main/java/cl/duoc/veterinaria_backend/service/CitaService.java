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
            cita.setEstado("Pendiente");
        }
        return repository.save(cita);
    }

    public Cita actualizar(Long id, Cita cambios) {
        Cita actual = buscar(id);
        actual.setFecha(cambios.getFecha());
        actual.setHora(cambios.getHora());
        actual.setMascotaId(cambios.getMascotaId());
        actual.setMotivo(cambios.getMotivo());
        actual.setEstado(cambios.getEstado());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Cita actual = buscar(id);
        repository.delete(actual);
    }
}