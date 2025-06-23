// fetchWithAuth.js - Lógica para peticiones autenticadas con refresco automático de token
import { buildHeaders, handleFetchError } from './utils';

/**
 * Realiza una petición fetch autenticada, refrescando el token si es necesario.
 * @param {string} url - URL a la que se hace la petición
 * @param {Object} options - Opciones para fetch (method, headers, body, etc)
 * @param {string} context - Contexto para logs/errores
 * @returns {Promise<Response>} Respuesta de fetch
 */
export async function fetchWithAuth(url, options = {}, context = 'API') {
  let response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers?.['Content-Type'] === 'application/json'),
  });

  if (response.status === 401) {
    // Intentar refrescar el token
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      const refreshResponse = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('access', data.access);
        // Reintentar la petición original con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: buildHeaders(options.headers?.['Content-Type'] === 'application/json'),
        });
      } else {
        // Refresh falló, limpiar tokens y lanzar error
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      }
    } else {
      throw new Error('No hay refresh token disponible.');
    }
  }

  if (!response.ok) {
    await handleFetchError(response, context);
  }
  return response;
}
