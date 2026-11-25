package cl.duoc.veterinaria_backend.service;

import cl.duoc.veterinaria_backend.model.Usuario;
import cl.duoc.veterinaria_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario crear(Usuario usuario) {
        usuario.setId(null);
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        usuario.setRol(usuario.getRol().trim().toUpperCase());
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        return repository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario cambios) {
        Usuario actual = buscar(id);
        actual.setNombre(cambios.getNombre());
        actual.setEmail(cambios.getEmail().trim().toLowerCase());
        actual.setRol(cambios.getRol().trim().toUpperCase());
        actual.setActivo(cambios.isActivo());

        if (cambios.getPassword() != null && !cambios.getPassword().trim().isEmpty()) {
            actual.setPassword(passwordEncoder.encode(cambios.getPassword()));
        }

        return repository.save(actual);
    }

    

    public void eliminar(Long id) {
        Usuario actual = buscar(id);
        repository.delete(actual);
    }


    
}