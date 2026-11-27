package cl.duoc.veterinaria_backend.controller;

import cl.duoc.veterinaria_backend.model.Usuario;
import cl.duoc.veterinaria_backend.repository.UsuarioRepository;
import cl.duoc.veterinaria_backend.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record LoginRequest(
            @NotBlank(message = "El correo es obligatorio")
            @Email(message = "Debe ser un correo válido")
            String email,

            @NotBlank(message = "La contraseña es obligatoria")
            String password
    ) {}

    public record LoginResponse(
            String token,
            Long id,
            String nombre,
            String email,
            String rol
    ) {}

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        if (!usuario.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario inactivo");
        }

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario);
        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}