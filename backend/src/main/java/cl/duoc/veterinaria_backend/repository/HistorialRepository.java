package cl.duoc.veterinaria_backend.repository;

import cl.duoc.veterinaria_backend.model.Historial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialRepository extends JpaRepository<Historial, Long> {
}