   const context = require.context('./', true, /\.spec\.jsx?$/);
   context.keys().forEach(context);

      // Carga todo el código fuente para que la cobertura mida el proyecto completo
   const fuente = require.context('../', true, /^\.\/(?!test\/|main\.jsx).*\.jsx?$/);
   fuente.keys().forEach(fuente);