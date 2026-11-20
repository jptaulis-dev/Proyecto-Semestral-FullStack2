package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Usuario;
import cl.duoc.veterinaria_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario crear(Usuario usuario) {
        // En una etapa posterior, aquí encriptaremos la contraseña
        usuario.setId(null);
        return repository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario cambios) {
        Usuario actual = buscar(id);
        actual.setNombre(cambios.getNombre());
        actual.setEmail(cambios.getEmail());
        actual.setRol(cambios.getRol());
        actual.setActivo(cambios.isActivo());
        
        // Solo actualizamos la contraseña si se envía una nueva
        if (cambios.getPassword() != null && !cambios.getPassword().trim().isEmpty()) {
            actual.setPassword(cambios.getPassword());
        }
        
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Usuario actual = buscar(id);
        repository.delete(actual);
    }
}