package cl.duoc.veterinaria_backend.controller;

import cl.duoc.veterinaria_backend.model.Mascota;
import cl.duoc.veterinaria_backend.service.MascotaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "http://localhost:5173") // Esto conectará con tu React
public class MascotaController {

    private final MascotaService service;

    public MascotaController(MascotaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mascota> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Mascota buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mascota crear(@Valid @RequestBody Mascota mascota) {
        return service.crear(mascota);
    }

    @PutMapping("/{id}")
    public Mascota actualizar(@PathVariable Long id, @Valid @RequestBody Mascota cambios) {
        return service.actualizar(id, cambios);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}