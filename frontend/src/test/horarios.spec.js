import { HORAS, hoy } from '../utils/horarios';

describe('utils/horarios', () => {
  it('define 18 bloques de atención', () => {
    expect(HORAS.length).toBe(18);
  });

  it('empieza a las 09:00 y termina a las 17:30', () => {
    expect(HORAS[0]).toBe('09:00');
    expect(HORAS[HORAS.length - 1]).toBe('17:30');
  });

  it('usa formato HH:MM con bloques de 30 minutos', () => {
    HORAS.forEach((h, i) => {
      expect(h).toMatch(/^\d{2}:\d{2}$/);
      if (i > 0) {
        const [h1, m1] = HORAS[i - 1].split(':').map(Number);
        const [h2, m2] = h.split(':').map(Number);
        expect(h2 * 60 + m2 - (h1 * 60 + m1)).toBe(30);
      }
    });
  });

  it('hoy() devuelve una fecha con formato AAAA-MM-DD', () => {
    expect(hoy()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('hoy() usa la fecha local y rellena mes y día con cero (reloj simulado)', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2030, 0, 5, 23, 30)); // 5 de enero, 23:30 hora local
    expect(hoy()).toBe('2030-01-05');
    jasmine.clock().uninstall();
  });
});