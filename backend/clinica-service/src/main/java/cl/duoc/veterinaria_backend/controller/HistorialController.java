package cl.duoc.veterinaria_backend.controller;

import cl.duoc.veterinaria_backend.model.Historial;
import cl.duoc.veterinaria_backend.service.HistorialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "http://localhost:5173")
public class HistorialController {

    private final HistorialService service;

    public HistorialController(HistorialService service) {
        this.service = service;
    }

    @GetMapping
    public List<Historial> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Historial buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Historial crear(@Valid @RequestBody Historial historial) {
        return service.crear(historial);
    }

    @PutMapping("/{id}")
    public Historial actualizar(@PathVariable Long id, @Valid @RequestBody Historial cambios) {
        return service.actualizar(id, cambios);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}