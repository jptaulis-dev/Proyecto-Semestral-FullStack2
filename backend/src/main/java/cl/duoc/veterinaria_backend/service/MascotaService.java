package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Mascota;
import cl.duoc.veterinaria_backend.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository repository;

    public MascotaService(MascotaRepository repository) {
        this.repository = repository;
    }

    public List<Mascota> listar() {
        return repository.findAll();
    }

    public Mascota buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada"));
    }

    public Mascota crear(Mascota mascota) {
        mascota.setId(null);
        if (mascota.getRaza() == null || mascota.getRaza().isBlank()) {
            mascota.setRaza("Mestizo");
        }
        return repository.save(mascota);
    }

    public Mascota actualizar(Long id, Mascota cambios) {
        Mascota actual = buscar(id);
        actual.setDuenoId(cambios.getDuenoId());
        actual.setNombre(cambios.getNombre());
        actual.setEspecie(cambios.getEspecie());
        actual.setSexo(cambios.getSexo());
        actual.setFechaNacimiento(cambios.getFechaNacimiento());
        if (cambios.getRaza() != null && !cambios.getRaza().isBlank()) {
            actual.setRaza(cambios.getRaza());
        }
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        repository.delete(buscar(id));
    }
}
