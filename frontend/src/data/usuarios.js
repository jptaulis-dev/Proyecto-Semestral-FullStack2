import { ROLES } from '../constants/roles';

export const usuariosIniciales = [
  { id: 1, nombre: 'Juan Pablo Taulis', email: 'admin@juanpablo.cl', rol: ROLES.ADMIN, activo: true },
  { id: 2, nombre: 'Marcela Soto', email: 'recepcion@sanmarcos.cl', rol: ROLES.RECEPCION, activo: true },
  { id: 3, nombre: 'Alejandro Chandia', email: 'alej.chandia@duocuc.cl', rol: ROLES.DUENO, activo: true },
  { id: 4, nombre: 'Dra. Carolina Reyes', email: 'creyes@sanmarcos.cl', rol: ROLES.RECEPCION, activo: true },
  { id: 5, nombre: 'María González', email: 'maria.gonzalez@correo.cl', rol: ROLES.DUENO, activo: true },
];