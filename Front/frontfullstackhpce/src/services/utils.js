// Funciones utilitarias para la gestión de headers y manejo de errores en servicios API.

/**
 * Construye los headers para peticiones fetch, incluyendo JWT si existe.
 * Si el usuario está autenticado, agrega el header Authorization con el token JWT.
 * Si isJson es true, agrega el header Content-Type para JSON.
 * @param {boolean} isJson - Si se debe incluir 'Content-Type: application/json'.
 * @returns {Object} Headers para fetch
 */
export function buildHeaders(isJson = true) {
  const token = localStorage.getItem('access');
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

/**
 * Maneja errores de respuesta de fetch y logs condicionales según entorno.
 * Si la respuesta no es exitosa, extrae el texto del error y lo muestra en consola (solo en desarrollo).
 * Lanza un error con el mensaje y detalles obtenidos.
 * @param {Response} response - Respuesta de fetch
 * @param {string} context - Contexto del error (ej: 'superuser', 'servicio')
 * @returns {Promise<never>} Lanza error con mensaje adecuado
 */
export async function handleFetchError(response, context = 'API') {
  let errorMsg = `Error en ${context}`;
  let details = '';
  try {
    details = await response.text();
  } catch {}
  if (import.meta.env.MODE === 'development') {
    // Solo loguea detalles en desarrollo
    console.error(`[${context}]`, details || response.statusText);
  }
  throw new Error(`${errorMsg}: ${details || response.statusText}`);
}
