# 🐾 Veterinaria San Marcos — Proyecto Semestral FullStack II (EP3)

![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![JWT](https://img.shields.io/badge/Security-JWT%20%2B%20RBAC-red)

Aplicación web **Full Stack** para la gestión integral de la clínica **Veterinaria San Marcos**: administración de usuarios, fichas de dueños y pacientes (mascotas), agendamiento/reagendamiento de citas e historial clínico y vacunación, protegida mediante **Spring Security + JWT** y control de acceso basado en roles (**RBAC**).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React, React Router, Vite, Bootstrap 5, React-Bootstrap, Leaflet |
| **Backend** | Java 17+, Spring Boot, Spring Data JPA, Spring Security, JJWT |
| **Base de Datos** | MySQL (`veterinaria_san_marcos`) vía JDBC e Hibernate JPA |
| **Documentación API** | SpringDoc OpenAPI 3 / Swagger UI |
| **Testing** | Karma, Jasmine, Testing Library (Frontend) & JUnit (Backend) |

---

## 🔐 Roles y Cuentas de Prueba

Al iniciar el backend por primera vez con la base de datos vacía, `CommandLineRunner` carga automáticamente los usuarios, dueños, mascotas, citas e historial inicial.

| Rol | Nombre | Correo electrónico | Contraseña | Permisos principales |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | Juan Pablo Taulis | `admin@juanpablo.cl` | `password123` | Acceso total (Usuarios, Agenda, Solicitudes, Mascotas, Historial) |
| **`RECEPCION`** | Marcela Soto | `recepcion@sanmarcos.cl` | `password123` | Gestión de Agenda, Solicitudes, Mascotas e Historial clínico |
| **`DUENO`** | Alejandro Chandía | `alej.chandia@duocuc.cl` | `password123` | Solicitar y cancelar sus citas, ver sus mascotas e historial |

---

## 📂 Estructura del Proyecto

```text
Proyecto-Semestral-FullStack2/
├── backend/
│   ├── src/main/java/cl/duoc/veterinaria_backend/
│   │   ├── controller/       # Endpoints REST (Auth, Usuarios, Dueños, Mascotas, Citas, Historial)
│   │   ├── model/            # Entidades JPA mapeadas a MySQL
│   │   ├── repository/       # Repositorios Spring Data JPA
│   │   ├── security/         # Configuración JWT, filtros, CORS, RBAC y carga inicial
│   │   └── service/          # Lógica de negocio y validaciones
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProtectedRoute y componentes de citas
│   │   ├── constants/        # Definición de roles (ADMIN, RECEPCION, DUENO)
│   │   ├── context/          # AuthContext (manejo de sesión y token JWT)
│   │   ├── data/             # Catálogos de servicios veterinarios y medicamentos
│   │   ├── pages/            # Vistas organizadas por rol (admin, dueno, recepcion)
│   │   ├── services/         # Cliente HTTP (api.js) y servicios REST
│   │   ├── test/             # Pruebas unitarias y de integración (Karma/Jasmine)
│   │   └── utils/            # Utilidades de horarios y formato de citas
│   └── package.json
├── documentacion/
│   └── captura/              # Documentación académica y evidencias
└── README.md

⚙️ Requisitos Previos
Java JDK 17 o superior.

Node.js 18+ y npm.

MySQL activo en localhost:3306 (por ejemplo, mediante XAMPP).

Google Chrome (para ejecutar la suite de pruebas con Karma).

🚀 Instalación y Ejecución Local
1. Encender MySQL y configurar conexión
Inicia el servicio MySQL en XAMPP (puerto 3306).

Verifica que backend/src/main/resources/application.properties apunte a MySQL:
spring.datasource.url=jdbc:mysql://localhost:3306/veterinaria_san_marcos?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

2. Levantar el Backend (Puerto 8080)
En una terminal dentro de la carpeta backend/:
# Windows (PowerShell / CMD)
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
API Base: http://localhost:8080/api

Swagger UI: http://localhost:8080/swagger-ui/index.html

OpenAPI Docs: http://localhost:8080/v3/api-docs

3. Levantar el Frontend (Puerto 5173)
En una segunda terminal dentro de la carpeta frontend/:
npm install
npm run dev
Aplicación Web: http://localhost:5173

🧪 Pruebas y Compilación
Pruebas Unitarias Frontend (Karma + Jasmine)
cd frontend
npm test

Compilación de Producción
# Frontend (genera frontend/dist/)
cd frontend
npm run build

# Backend (valida compilación Maven)
cd backend
.\mvnw.cmd clean compile

👥 Equipo de Desarrollo
Juan Pablo Taulis

Alejandro Chandía

Proyecto desarrollado para la asignatura Desarrollo FullStack II — Evaluación Parcial 3 (Duoc UC).