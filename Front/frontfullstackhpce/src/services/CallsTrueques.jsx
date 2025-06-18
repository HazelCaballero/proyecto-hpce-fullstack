import { buildHeaders, handleFetchError } from './utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


/**
 * Obtiene la lista de trueques (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de trueques
 */
async function GetTrueques() {
  try {
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


/**
 * Crea un nuevo trueque.
 * @param {Object} objeto - Datos del trueque
 * @returns {Promise<Object>} - Trueque creado
 */
async function PostTrueques(objeto) {
  try {
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


/**
 * Actualiza un trueque existente.
 * @param {number} id - ID del trueque a actualizar
 * @param {Object} objeto - Nuevos datos del trueque
 * @returns {Promise<Object>} - Trueque actualizado
 */
async function UpdateTrueques(id, objeto) {
  try {
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'trueques');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


/**
 * Elimina un trueque.
 * @param {number} id - ID del trueque a eliminar
 * @returns {Promise<void>}
 */
async function DeleteTrueque(id) {
  try {
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'DELETE',
      headers: buildHeaders(),
    })
    if (!response.ok) await handleFetchError(response, 'trueques');
  } catch (error) {
    throw error;
  }
}


export default { GetTrueques, PostTrueques, UpdateTrueques, DeleteTrueque };
