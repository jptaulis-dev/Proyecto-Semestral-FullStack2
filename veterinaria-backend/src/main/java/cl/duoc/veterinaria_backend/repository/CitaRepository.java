package cl.duoc.veterinaria_backend.repository;

import cl.duoc.veterinaria_backend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
}