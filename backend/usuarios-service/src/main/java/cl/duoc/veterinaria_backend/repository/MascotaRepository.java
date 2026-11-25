package cl.duoc.veterinaria_backend.repository;

import cl.duoc.veterinaria_backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
}
