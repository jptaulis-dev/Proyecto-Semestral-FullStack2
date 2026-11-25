package cl.duoc.veterinaria_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del dueño es obligatorio")
    private Long duenoId;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La especie es obligatoria")
    private String especie; // Ej: "perro", "gato", "conejo"

    @NotBlank(message = "El sexo es obligatorio")
    private String sexo; // Ej: "macho", "hembra"

    private LocalDate fechaNacimiento;

    private String raza = "Mestizo";

    public Mascota() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDuenoId() { return duenoId; }
    public void setDuenoId(Long duenoId) { this.duenoId = duenoId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
}