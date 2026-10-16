// Horario simulado (el caso no lo indica): bloques de 30 min entre 09:00 y 17:30
export const HORAS = Array.from({ length: 18 }, (_, i) => {
  const min = 9 * 60 + i * 30;
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
});

// Fecha local en formato YYYY-MM-DD
export const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};