// MisInterfaces.js
// En JavaScript usamos PropTypes o JSDoc para documentar las props
/**
 * @typedef {Object} propSesion
 * @property {React.ReactNode} children
 */

/**
 * @typedef {Object} propUsuario
 * @property {MiSesion} autenticado
 * @property {function(MiSesion): void} actualizar
 */