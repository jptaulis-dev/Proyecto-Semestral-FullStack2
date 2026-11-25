# Veterinaria San Marcos — Proyecto Semestral FullStack

Aplicación web Full Stack para la gestión y agendamiento de citas de una clínica veterinaria.

## Tecnologías

- Frontend: React, React Router, Vite, Bootstrap y React-Bootstrap.
- Backend: Java 17, Spring Boot 4, Spring Data JPA, Spring Security y JWT.
- Persistencia: H2 embebida para desarrollo local; soporte para MySQL mediante configuración JDBC.
- Documentación API: SpringDoc OpenAPI y Swagger UI.
- Pruebas frontend: Karma, Jasmine y Testing Library.
- Mapas: Leaflet y React-Leaflet.

## Estructura del proyecto

```text
Proyecto-Semestral-FullStack2/
├── backend/
│   ├── .mvn/wrapper/                  # Configuración del Maven Wrapper
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/cl/duoc/veterinaria_backend/
│   │   │   │   ├── controller/       # Endpoints REST
│   │   │   │   ├── model/            # Entidades JPA
│   │   │   │   ├── repository/       # Repositorios Spring Data JPA
│   │   │   │   ├── security/         # JWT y configuración de seguridad
│   │   │   │   └── service/         # Reglas de negocio
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/cl/duoc/veterinaria_backend/
│   ├── mvnw                          # Maven Wrapper para Linux/macOS
│   ├── mvnw.cmd                      # Maven Wrapper para Windows
│   └── pom.xml                       # Dependencias y configuración Maven
├── frontend/
│   ├── src/
│   │   ├── components/               # Componentes reutilizables
│   │   │   └── citas/                # Componentes relacionados con citas
│   │   ├── constants/                # Roles y constantes globales
│   │   ├── context/                  # Estado y contexto de autenticación
│   │   ├── data/                     # Catálogos y datos iniciales
│   │   ├── pages/                    # Vistas de la aplicación
│   │   │   ├── admin/                # Administración
│   │   │   ├── dueno/                # Funcionalidades del dueño
│   │   │   └── recepcion/            # Funcionalidades de recepción
│   │   ├── services/                 # Clientes HTTP y acceso a la API
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
```

## Requisitos

- Node.js y npm.
- Java 17 o superior.
- Google Chrome para ejecutar las pruebas frontend.
- Git.

## Instalación

Instale las dependencias del frontend:

```bash
cd frontend
npm install
```

## Ejecución local

### Backend

Desde `backend/`:

```bash
./mvnw spring-boot:run
```

En Windows:

```cmd
mvnw.cmd spring-boot:run
```

El backend utiliza una base H2 embebida por defecto, por lo que no requiere configurar MySQL para desarrollo local.

- API: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/swagger-ui/index.html>
- OpenAPI: <http://localhost:8080/v3/api-docs>

### Frontend

Desde `frontend/`:

```bash
npm run dev
```

- Frontend: <http://localhost:5173>

## Configuración de la API

El frontend consume el backend mediante `http://localhost:8080/api`.

El backend debe ejecutarse junto al frontend. Los datos almacenados en H2 se recrean al reiniciar Spring Boot.

## Pruebas frontend

Ejecute las pruebas desde `frontend/`:

```bash
npm test
```

Para mantener Karma en modo observación:

```bash
npm run test:watch
```

## Compilación frontend

```bash
cd frontend
npm run build
```

El resultado se genera en `frontend/dist/`.

## Compilación backend

```bash
cd backend
./mvnw clean compile
```

Los artefactos generados como `target/`, `dist/`, `coverage/` y `node_modules/` están excluidos del repositorio mediante `.gitignore`.
