# Veterinaria San Marcos — Proyecto Semestral FullStack (EP3)

Aplicación web Full Stack para la gestión clínica, fichas de pacientes, historial/vacunación y agendamiento de citas de la clínica **Veterinaria San Marcos**, integrada con autenticación JWT y control de acceso basado en roles (RBAC).

## Arquitectura y Tecnologías

- **Arquitectura:** Backend monolítico en Spring Boot (`backend/`) consumido de forma asíncrona por el frontend SPA en React (`frontend/`).
- **Frontend:** React, React Router, Vite, Bootstrap y React-Bootstrap.
- **Backend:** Java 17+, Spring Boot, Spring Data JPA, Spring Security y JWT (`JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`).
- **Persistencia:** MySQL (`veterinaria_san_marcos`) mediante JDBC y Hibernate JPA (con carga inicial automática de datos de prueba al iniciar la aplicación).
- **Documentación API:** SpringDoc OpenAPI y Swagger UI.
- **Pruebas frontend:** Karma, Jasmine y Testing Library.
- **Mapas:** Leaflet y React-Leaflet.

## Roles y Cuentas de Prueba

El sistema contempla tres roles principales (`ADMIN`, `RECEPCION` y `DUENO`) con rutas y permisos diferenciados tanto en el frontend como en los endpoints del backend.

- **Administrador (`ADMIN`):** `admin@juanpablo.cl` / `password123`
- **Recepción (`RECEPCION`):** `recepcion@sanmarcos.cl` / `password123`
- **Dueño (`DUENO`):** `alej.chandia@duocuc.cl` / `password123`

## Estructura del Proyecto

```text
Proyecto-Semestral-FullStack2/
├── backend/
│   ├── .mvn/wrapper/                  # Configuración del Maven Wrapper
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/cl/duoc/veterinaria_backend/
│   │   │   │   ├── controller/       # Endpoints REST (Auth, Usuarios, Dueños, Mascotas, Citas, Historial)
│   │   │   │   ├── model/            # Entidades JPA
│   │   │   │   ├── repository/       # Repositorios Spring Data JPA
│   │   │   │   ├── security/         # JWT, CORS, RBAC y seed inicial
│   │   │   │   └── service/          # Reglas de negocio
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/cl/duoc/veterinaria_backend/
│   ├── mvnw                          # Maven Wrapper para Linux/macOS
│   ├── mvnw.cmd                      # Maven Wrapper para Windows
│   └── pom.xml                       # Dependencias y configuración Maven
├── frontend/
│   ├── src/
│   │   ├── components/               # Componentes reutilizables y rutas protegidas
│   │   │   └── citas/                # Componentes relacionados con citas
│   │   ├── constants/                # Roles y constantes globales
│   │   ├── context/                  # Estado y contexto de autenticación JWT
│   │   ├── data/                     # Catálogos de servicios y medicamentos
│   │   ├── pages/                    # Vistas de la aplicación
│   │   │   ├── admin/                # Administración de usuarios
│   │   │   ├── dueno/                # Funcionalidades del dueño
│   │   │   └── recepcion/            # Funcionalidades de recepción
│   │   ├── services/                 # Cliente HTTP (`api.js`) y servicios de dominio
│   │   ├── test/                     # Pruebas Karma/Jasmine
│   │   └── utils/                    # Utilidades de citas y horarios
│   ├── karma.conf.cjs                # Configuración de pruebas
│   ├── package.json                  # Dependencias y scripts npm
│   ├── vite.config.js                # Configuración de Vite
│   └── webpack.test.config.cjs       # Configuración de pruebas Webpack
├── documentacion/
│   └── captura/                      # Documentos y capturas académicas
├── .vscode/settings.json             # Integración Maven/Java de VS Code
├── .gitignore
└── README.md


Requisitos Previos
Node.js y npm.

Java 17 o superior.

Servidor MySQL activo (por ejemplo, vía XAMPP en el puerto 3306) y base de datos veterinaria_san_marcos (o creada automáticamente según application.properties).

Google Chrome para ejecutar las pruebas frontend.

Git.

Instalación
Instale las dependencias del frontend:

Bash
cd frontend
npm install
Ejecución Local
1. Base de Datos y Backend
Verifique que MySQL esté corriendo y revise backend/src/main/resources/application.properties (jdbc:mysql://localhost:3306/veterinaria_san_marcos).

Desde backend/:

Bash
./mvnw spring-boot:run
En Windows (PowerShell o CMD):

DOS
.\mvnw.cmd spring-boot:run
API REST: http://localhost:8080/api

Swagger UI: http://localhost:8080/swagger-ui/index.html

OpenAPI JSON: http://localhost:8080/v3/api-docs

2. Frontend
Desde frontend/:

Bash
npm run dev
Aplicación web: http://localhost:5173

Configuración de la API y Autenticación
El frontend consume el backend mediante http://localhost:8080/api (frontend/src/services/api.js).

Al iniciar sesión en /login (POST /api/auth/login), el token JWT se almacena y se envía en la cabecera Authorization: Bearer <token> en las peticiones protegidas.

Tanto el backend como el frontend deben estar en ejecución para operar con datos persistidos en MySQL.

Pruebas Frontend
Ejecute las pruebas desde frontend/:

Bash
npm test
Para mantener Karma en modo observación:

Bash
npm run test:watch
Compilación
Frontend
Bash
cd frontend
npm run build
El resultado se genera en frontend/dist/.

Backend
Bash
cd backend
./mvnw clean compile
Los artefactos generados como target/, dist/, coverage/ y node_modules/ están excluidos del repositorio mediante .gitignore.