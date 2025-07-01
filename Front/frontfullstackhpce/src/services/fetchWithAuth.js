// Lógica centralizada para peticiones autenticadas con manejo automático de refresco de token JWT.
// Permite que cualquier llamada a la API que reciba un 401 intente refrescar el token y reintente la petición.
// Si el refresh token también ha expirado, limpia el almacenamiento y lanza un error de sesión expirada.
import { buildHeaders, handleFetchError } from './utils';

/**
 * Realiza una petición fetch autenticada, refrescando el token si es necesario.
 * Si el token de acceso ha expirado (401), intenta refrescarlo automáticamente y reintenta la petición.
 * Si el refresh token también ha expirado, limpia el almacenamiento y lanza un error de sesión expirada.
 *
 * @param {string} url - URL a la que se hace la petición
 * @param {Object} options - Opciones para fetch (method, headers, body, etc)
 * @param {string} context - Contexto para logs/errores
 * @returns {Promise<Response>} Respuesta de fetch
 */
export async function fetchWithAuth(url, options = {}, context = 'API') {
  // Realiza la petición original con headers construidos automáticamente
  let response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers?.['Content-Type'] === 'application/json'),
  });

  if (response.status === 401) {
    // Si el token expiró, intenta refrescarlo
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      const refreshResponse = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshResponse.ok) {
        // Si el refresh fue exitoso, guarda el nuevo access token y reintenta la petición original
        const data = await refreshResponse.json();
        localStorage.setItem('access', data.access);
        response = await fetch(url, {
          ...options,
          headers: buildHeaders(options.headers?.['Content-Type'] === 'application/json'),
        });
      } else {
        // Si el refresh falla, elimina los tokens y lanza error de sesión expirada
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      }
    } else {
      // No hay refresh token disponible
      throw new Error('No hay refresh token disponible.');
    }
  }

  // Si la respuesta no es exitosa, maneja el error con detalles
  if (!response.ok) {
    await handleFetchError(response, context);
  }
  return response;
}
