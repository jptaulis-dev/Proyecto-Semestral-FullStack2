package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Dueno;
import cl.duoc.veterinaria_backend.repository.DuenoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class DuenoService {

    private final DuenoRepository repository;

    public DuenoService(DuenoRepository repository) {
        this.repository = repository;
    }

    public List<Dueno> listar() {
        return repository.findAll();
    }

    public Dueno buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Dueño no encontrado"));
    }

    public Dueno buscarPorUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Dueño no encontrado para el usuario"));
    }

    public Dueno crear(Dueno dueno) {
        dueno.setId(null);
        if (dueno.getTelefono() == null) dueno.setTelefono("");
        return repository.save(dueno);
    }
}
