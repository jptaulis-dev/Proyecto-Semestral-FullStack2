package cl.duoc.veterinaria_backend.repository;

import cl.duoc.veterinaria_backend.model.Dueno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DuenoRepository extends JpaRepository<Dueno, Long> {
    Optional<Dueno> findByUsuarioId(Long usuarioId);
}
