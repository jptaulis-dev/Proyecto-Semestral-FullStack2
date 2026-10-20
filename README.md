# Proyecto Semestral FullStack 2

Aplicación web para la gestión de una clínica veterinaria. El repositorio contiene el frontend desarrollado con React y la documentación del proyecto.

## Estructura del repositorio

```text
Proyecto-Semestral-FullStack2/
├── documentacion/
│   └── captura/                  # Capturas y evidencias del proyecto
├── frontend/
│   ├── index.html
│   ├── package.json              # Dependencias y comandos del frontend
│   ├── vite.config.js
│   ├── karma.conf.cjs
│   ├── webpack.test.config.cjs
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/           # Componentes compartidos y de citas
│       ├── constants/            # Constantes de la aplicación
│       ├── context/              # Contexto de autenticación
│       ├── data/                 # Datos de usuarios, mascotas y servicios
│       ├── pages/                # Vistas de administración, recepción y dueños
│       ├── services/             # Servicios de citas, usuarios e historial
│       ├── test/                 # Pruebas automatizadas
│       └── utils/                # Utilidades de citas y horarios
├── package.json                  # Dependencias a nivel raíz
└── README.md
```

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
