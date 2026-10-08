# Proyecto Semestral FullStack 2

## Descripción general
Este repositorio corresponde a un proyecto desarrollado en formato FullStack, con una parte principal enfocada en la interfaz web del cliente y una carpeta de documentación para entregables, análisis y pruebas del proyecto.

## Estructura del proyecto

```text
Proyecto-Semestral-FullStack2/
├── README.md                      # Descripción general del proyecto
├── .gitignore                     # Archivos ignorados por Git
├── documentacion/                 # Documentación del proyecto
│   ├── Cobertura-Testing.docx     # Documento de cobertura y pruebas
│   ├── ERS-V2.docx               # Documentación del sistema o requisitos
│   └── captura/                  # Capturas de pantalla y evidencias visuales
├── frontend/                      # Aplicación frontend
│   ├── index.html                 # Archivo HTML principal
│   ├── package.json               # Dependencias y scripts del proyecto
│   ├── vite.config.js             # Configuración de Vite
│   ├── karma.conf.cjs             # Configuración de pruebas con Karma
│   ├── webpack.test.config.cjs    # Configuración de webpack para testing
│   ├── .babelrc                   # Configuración de Babel
│   └── src/                       # Código fuente de la aplicación
│       ├── App.jsx                # Componente principal de la app
│       ├── main.jsx               # Punto de entrada de React
│       ├── components/            # Componentes reutilizables (navbar, badges, rutas protegidas)
│       ├── context/               # Contextos de React para estado global
│       ├── data/                  # Datos o mocks estáticos
│       ├── pages/                 # Páginas o vistas de la aplicación
│       ├── services/              # Lógica de servicios y consumo de APIs
│       └── test/                 # Pruebas del frontend
└── .git/                          # Historial de Git del proyecto
```

## ¿Qué contiene cada parte?

- `documentacion/`: almacena el material de apoyo académico, documentación técnica y evidencias visuales del proyecto.
- `frontend/`: concentra la aplicación del cliente, incluyendo estructura de páginas, componentes y pruebas.
- `src/components/`: reutiliza elementos de interfaz como navegación, etiquetas de estado y protección de rutas.
- `src/context/`: define estados compartidos entre componentes.
- `src/pages/`: agrupa las pantallas principales de la aplicación.
- `src/services/`: encapsula las llamadas a servicios o lógica de negocio consumida por la UI.
- `src/test/`: contiene pruebas para verificar el funcionamiento del frontend.

## Resumen
La estructura del proyecto está organizada para separar claramente la documentación, la lógica de la interfaz, los servicios y las pruebas, facilitando el mantenimiento y la evolución del sistema.
