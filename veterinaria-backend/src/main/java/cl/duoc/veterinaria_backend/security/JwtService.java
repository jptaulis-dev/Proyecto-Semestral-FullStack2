package cl.duoc.veterinaria_backend.security;

import cl.duoc.veterinaria_backend.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", usuario.getRol());
        claims.put("usuarioId", usuario.getId());
        claims.put("nombre", usuario.getNombre());

        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(usuario.getEmail())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(getSigningKey())
                .compact();
    }

    private Claims extraerTodosLosClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extraerEmail(String token) {
        return extraerTodosLosClaims(token).getSubject();
    }

    public String extraerRol(String token) {
        Object rol = extraerTodosLosClaims(token).get("rol");
        return rol != null ? rol.toString() : "";
    }

    public boolean esTokenValido(String token, String emailEsperado) {
        try {
            Claims claims = extraerTodosLosClaims(token);
            String emailToken = claims.getSubject();
            Date expiracion = claims.getExpiration();
            return emailToken.equals(emailEsperado) && expiracion.after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }
}