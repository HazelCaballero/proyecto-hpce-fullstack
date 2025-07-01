// Servicio para operaciones CRUD de trueques. Utiliza fetchWithAuth para manejar autenticación y refresco de token.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';
import { buildHeaders, handleFetchError } from './utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Obtiene la lista de trueques (requiere autenticación JWT).
 * Realiza una petición GET a /trueques/ y retorna el array de trueques.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de trueques
 */
async function GetTrueques() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}trueques/`, {
      method: 'GET',
    }, 'trueques');
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Crea un nuevo trueque.
 * Realiza una petición POST a /trueques/ con los datos proporcionados.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {Object} objeto - Datos del trueque
 * @returns {Promise<Object>} - Trueque creado
 */
async function PostTrueques(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}trueques/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'trueques');
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Actualiza un trueque existente.
 * Realiza una petición PUT a /trueques/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del trueque a actualizar
 * @param {Object} objeto - Nuevos datos del trueque
 * @returns {Promise<Object>} - Trueque actualizado
 */
async function UpdateTrueques(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}trueques/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'trueques');
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Elimina un trueque por su ID.
 * Realiza una petición DELETE a /trueques/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del trueque a eliminar
 * @returns {Promise<void>}
 */
async function DeleteTrueque(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}trueques/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'trueques');
    if (!response.ok) await handleFetchError(response, 'trueques');
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}




// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetTrueques, PostTrueques, UpdateTrueques, DeleteTrueque };
