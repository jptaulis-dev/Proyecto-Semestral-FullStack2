package cl.duoc.veterinaria_backend.controller;

import cl.duoc.veterinaria_backend.model.Dueno;
import cl.duoc.veterinaria_backend.service.DuenoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/duenos")
@CrossOrigin(origins = "http://localhost:5173")
public class DuenoController {

    private final DuenoService service;

    public DuenoController(DuenoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Dueno> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Dueno buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @GetMapping("/por-usuario/{usuarioId}")
    public Dueno buscarPorUsuarioId(@PathVariable Long usuarioId) {
        return service.buscarPorUsuarioId(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Dueno crear(@Valid @RequestBody Dueno dueno) {
        return service.crear(dueno);
    }
}
