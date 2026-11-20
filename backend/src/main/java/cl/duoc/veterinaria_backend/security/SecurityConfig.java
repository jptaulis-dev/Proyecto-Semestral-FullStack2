package cl.duoc.veterinaria_backend.security;

import cl.duoc.veterinaria_backend.model.*;
import cl.duoc.veterinaria_backend.repository.*;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/api/auth/login",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/historial/**").hasAnyRole("ADMIN", "RECEPCION", "DUENO")
                .requestMatchers("/api/historial/**").hasAnyRole("ADMIN", "RECEPCION")
                .requestMatchers(HttpMethod.DELETE, "/api/mascotas/**", "/api/citas/**").hasAnyRole("ADMIN", "RECEPCION")
                .requestMatchers("/api/mascotas/**", "/api/citas/**", "/api/duenos/**").hasAnyRole("ADMIN", "RECEPCION", "DUENO")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CommandLineRunner seedInitialData(
            UsuarioRepository usuarioRepository,
            DuenoRepository duenoRepository,
            MascotaRepository mascotaRepository,
            CitaRepository citaRepository,
            HistorialRepository historialRepository,
            PasswordEncoder encoder
    ) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario u1 = crearUsuario(usuarioRepository, encoder, "Juan Pablo Taulis", "admin@juanpablo.cl", "password123", "ADMIN");
                Usuario u2 = crearUsuario(usuarioRepository, encoder, "Marcela Soto", "recepcion@sanmarcos.cl", "password123", "RECEPCION");
                Usuario u3 = crearUsuario(usuarioRepository, encoder, "Alejandro Chandia", "alej.chandia@duocuc.cl", "password123", "DUENO");
                crearUsuario(usuarioRepository, encoder, "Dra. Carolina Reyes", "creyes@sanmarcos.cl", "password123", "RECEPCION");
                Usuario u5 = crearUsuario(usuarioRepository, encoder, "María González", "maria.gonzalez@correo.cl", "password123", "DUENO");

                Dueno d1 = crearDueno(duenoRepository, u3.getId(), "Alejandro Chandia", "+56 9 1111 1111");
                Dueno d2 = crearDueno(duenoRepository, u5.getId(), "María González", "+56 9 2222 2222");

                Mascota m1 = crearMascota(mascotaRepository, d1.getId(), "Firulais", "perro", "macho", LocalDate.of(2019, 3, 20), "Mestizo");
                Mascota m2 = crearMascota(mascotaRepository, d1.getId(), "Luna", "gato", "hembra", LocalDate.of(2021, 7, 15), "Doméstico");
                Mascota m3 = crearMascota(mascotaRepository, d2.getId(), "Rocky", "perro", "macho", LocalDate.of(2020, 11, 2), "Terrier");
                crearMascota(mascotaRepository, d2.getId(), "Copito", "conejo", "hembra", LocalDate.of(2023, 1, 10), "Enano");

                crearCita(citaRepository, m1.getId(), d1.getId(), "SV001", LocalDate.of(2026, 10, 20), LocalTime.of(10, 0), "Control general", "confirmada");
                crearCita(citaRepository, m2.getId(), d1.getId(), "VA003", LocalDate.of(2026, 10, 22), LocalTime.of(11, 30), "Refuerzo anual", "pendiente");
                crearCita(citaRepository, m3.getId(), d2.getId(), "SV001", LocalDate.of(2026, 10, 21), LocalTime.of(9, 0), "Cojea de una pata", "reagendada");

                crearHistorial(historialRepository, m1.getId(), LocalDate.of(2026, 9, 10), "Dra. Carolina Reyes", "Vacunación", "Paciente sano. Refuerzo anual.", "Vacuna séxtuple", "ME019", LocalDate.of(2026, 11, 28), "");
                crearHistorial(historialRepository, m2.getId(), LocalDate.of(2026, 8, 20), "Dra. Carolina Reyes", "Vacunación", "Control felino e inmunización sin reacciones.", "Triple felina", "ME020", LocalDate.of(2026, 11, 22), "");
            }
        };
    }

    private Usuario crearUsuario(UsuarioRepository repo, PasswordEncoder enc, String nombre, String email, String pass, String rol) {
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setPassword(enc.encode(pass));
        u.setRol(rol);
        u.setActivo(true);
        return repo.save(u);
    }

    private Dueno crearDueno(DuenoRepository repo, Long usuarioId, String nombre, String tel) {
        Dueno d = new Dueno();
        d.setUsuarioId(usuarioId);
        d.setNombre(nombre);
        d.setTelefono(tel);
        return repo.save(d);
    }

    private Mascota crearMascota(MascotaRepository repo, Long duenoId, String nombre, String especie, String sexo, LocalDate nac, String raza) {
        Mascota m = new Mascota();
        m.setDuenoId(duenoId);
        m.setNombre(nombre);
        m.setEspecie(especie);
        m.setSexo(sexo);
        m.setFechaNacimiento(nac);
        m.setRaza(raza);
        return repo.save(m);
    }

    private void crearCita(CitaRepository repo, Long mascotaId, Long duenoId, String serv, LocalDate fecha, LocalTime hora, String motivo, String estado) {
        Cita c = new Cita();
        c.setMascotaId(mascotaId);
        c.setDuenoId(duenoId);
        c.setServicioCodigo(serv);
        c.setFecha(fecha);
        c.setHora(hora);
        c.setMotivo(motivo);
        c.setEstado(estado);
        repo.save(c);
    }

    private void crearHistorial(HistorialRepository repo, Long mascotaId, LocalDate fecha, String vet, String tipo, String diag, String trat, String med, LocalDate prox, String obs) {
        Historial h = new Historial();
        h.setMascotaId(mascotaId);
        h.setFecha(fecha);
        h.setVeterinario(vet);
        h.setTipo(tipo);
        h.setDiagnostico(diag);
        h.setTratamiento(trat);
        h.setMedicamentoCodigo(med);
        h.setProximoControl(prox);
        h.setObservaciones(obs);
        repo.save(h);
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String schemeName = "bearerAuth";
        return new OpenAPI()
            .addSecurityItem(new SecurityRequirement().addList(schemeName))
            .components(new Components()
                .addSecuritySchemes(schemeName, new SecurityScheme()
                    .name(schemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                )
            );
    }
}