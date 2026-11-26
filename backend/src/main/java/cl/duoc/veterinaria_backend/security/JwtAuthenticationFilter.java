package cl.duoc.veterinaria_backend.security;

import cl.duoc.veterinaria_backend.model.Usuario;
import cl.duoc.veterinaria_backend.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email;

        try {
            email = jwtService.extraerEmail(token);
        } catch (Exception ex) {
            filterChain.doFilter(request, response);
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

            if (usuarioOpt.isPresent() && usuarioOpt.get().isActivo()) {
                Usuario usuario = usuarioOpt.get();
                if (jwtService.esTokenValido(token, usuario.getEmail())) {
                    String rolNormalizado = usuario.getRol().trim().toUpperCase();
                    if (!rolNormalizado.startsWith("ROLE_")) {
                        rolNormalizado = "ROLE_" + rolNormalizado;
                    }

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rolNormalizado);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    usuario.getEmail(),
                                    null,
                                    List.of(authority)
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}