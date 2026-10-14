import { servicios } from '../data/servicios';

export const obtenerServicio = (codigo) =>
  servicios.find((s) => s.codigo === codigo) || null;

// Solo servicios compatibles con la especie y el sexo de la mascota
export const serviciosParaMascota = (mascota) =>
  servicios.filter(
    (s) =>
      s.especies.includes(mascota.especie) &&
      (!s.soloHembras || mascota.sexo === 'hembra')
  );