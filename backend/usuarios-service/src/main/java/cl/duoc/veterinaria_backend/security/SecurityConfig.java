package cl.duoc.veterinaria_backend.security;

import cl.duoc.veterinaria_backend.model.Usuario;
import cl.duoc.veterinaria_backend.repository.UsuarioRepository;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


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
            .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/api/auth/login",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/historial/**").hasAnyRole("ADMIN", "RECEPCION")
                .requestMatchers(HttpMethod.DELETE, "/api/mascotas/**", "/api/citas/**").hasAnyRole("ADMIN", "RECEPCION")
                .requestMatchers("/api/mascotas/**", "/api/citas/**").hasAnyRole("ADMIN", "RECEPCION", "DUENO")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CommandLineRunner seedInitialUsers(UsuarioRepository usuarioRepository, PasswordEncoder encoder) {
        return args -> {
            if (usuarioRepository.findByEmail("admin@sanmarcos.cl").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador San Marcos");
                admin.setEmail("admin@sanmarcos.cl");
                admin.setPassword(encoder.encode("Admin1234!"));
                admin.setRol("ADMIN");
                admin.setActivo(true);
                usuarioRepository.save(admin);
            }
            if (usuarioRepository.findByEmail("recepcion@sanmarcos.cl").isEmpty()) {
                Usuario recepcion = new Usuario();
                recepcion.setNombre("Recepción San Marcos");
                recepcion.setEmail("recepcion@sanmarcos.cl");
                recepcion.setPassword(encoder.encode("Recep1234!"));
                recepcion.setRol("RECEPCION");
                recepcion.setActivo(true);
                usuarioRepository.save(recepcion);
            }
            if (usuarioRepository.findByEmail("dueno@sanmarcos.cl").isEmpty()) {
                Usuario dueno = new Usuario();
                dueno.setNombre("Dueño Demo");
                dueno.setEmail("dueno@sanmarcos.cl");
                dueno.setPassword(encoder.encode("Dueno1234!"));
                dueno.setRol("DUENO");
                dueno.setActivo(true);
                usuarioRepository.save(dueno);
            }
        };
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