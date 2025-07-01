// Servicio para operaciones CRUD de superusuario. Permite obtener, crear, actualizar y eliminar superusuarios mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { buildHeaders, handleFetchError } from './utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


/**
 * Obtiene la información del superusuario (requiere autenticación JWT).
 * Realiza una petición GET a /ver-superusuario/ y retorna los datos del superusuario.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Object>} - Datos del superusuario
 */
async function GetSuperUser() {
  try {
    const response = await fetch(`${BASE_URL}ver-superusuario/`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Crea un nuevo superusuario.
 * Realiza una petición POST a /crear-superusuario/ con los datos proporcionados.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {Object} objeto - Datos del superusuario
 * @returns {Promise<Object>} - Superusuario creado
 */
async function PostSuperUser(objeto) {
  try {
    const response = await fetch(`${BASE_URL}crear-superusuario/`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Actualiza un superusuario existente.
 * Realiza una petición PUT a /actualizar-superusuario/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del superusuario a actualizar
 * @param {Object} objeto - Nuevos datos del superusuario
 * @returns {Promise<Object>} - Superusuario actualizado
 */
async function UpdateSuperUser(id, objeto) {
  try {
    const response = await fetch(`${BASE_URL}actualizar-superusuario/${id}/`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



/**
 * Elimina un superusuario por su ID.
 * Realiza una petición DELETE a /eliminar-superusuario/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del superusuario a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteSuperUser(id) {
  try {
    const response = await fetch(`${BASE_URL}eliminar-superusuario/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return { message: `Superusuario con id ${id} eliminado correctamente` };
  } catch (error) {
    // Propaga el error para manejo en la UI
    throw error;
  }
}



// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetSuperUser, PostSuperUser, UpdateSuperUser, DeleteSuperUser };
