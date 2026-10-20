# 🐾 Veterinaria San Marcos - Proyecto Semestral FullStack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Testing](https://img.shields.io/badge/Testing-Karma%20%7C%20Jasmine-8A2BE2?style=for-the-badge)

Aplicación web desarrollada como **Single Page Application (SPA)** para la gestión y agendamiento de citas de una clínica veterinaria. Este repositorio contiene el frontend interactivo construido con React y la documentación oficial del proyecto.

---

## 🚀 Tecnologías Utilizadas

*   **Core:** React.js y React Router DOM (para navegación SPA).
*   **Build Tool:** Vite (empaquetador ultrarrápido).
*   **UI & Estilos:** Bootstrap y React-Bootstrap (diseño 100% responsivo).
*   **Mapas:** Leaflet y React-Leaflet (mapa interactivo con geolocalización).
*   **Testing:** Karma y Jasmine (Suite de 82 pruebas unitarias automatizadas).

---

## 📂 Estructura del Repositorio

El proyecto está dividido de forma modular para separar la documentación académica de la lógica de negocio y las vistas del cliente:

```text
Proyecto-Semestral-FullStack2/
├── documentacion/                 # Documentación del proyecto (Word/Excel)
│   ├── captura/                   # Capturas de pantalla y evidencias visuales
│   └── 09_Plantilla_Documento_Cobertura_Testing_EP2.docx
├── frontend/                      # Aplicación React
│   ├── src/                       
│   │   ├── components/            # Componentes reutilizables (Tablas, Navbar, Badges)
│   │   ├── constants/             # Constantes globales de la aplicación (Roles RBAC)
│   │   ├── context/               # Contexto de autenticación y sesión
│   │   ├── data/                  # Datos locales y mocks iniciales
│   │   ├── pages/                 # Vistas protegidas según rol de usuario
│   │   ├── services/              # Lógica de negocio (CRUD simulado con localStorage)
│   │   ├── test/                  # Suite de 82 pruebas unitarias
│   │   └── utils/                 # Utilidades de formato (Fechas, Horarios)
│   ├── karma.conf.cjs             # Configuración del entorno de pruebas
│   ├── package.json               # Dependencias del frontend
│   └── vite.config.js             # Configuración de Vite
└── README.md                      # Este documento

## Tecnologías

- React y React Router
- Vite
- Bootstrap y React-Bootstrap
- Karma y Jasmine para las pruebas

## Requisitos

- Node.js y npm
- Google Chrome para ejecutar las pruebas con Karma

## Instalación y ejecución

Desde la carpeta del frontend, instala las dependencias y levanta el servidor de desarrollo:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

## Pruebas

Ejecuta la suite de pruebas desde `frontend/`:

```bash
npm test
```

Para mantener las pruebas en modo observación:

```bash
npm run test:watch
```

## Compilación

Genera la versión de producción con:

```bash
npm run build
```

Los archivos compilados se generan en `frontend/dist/`.
