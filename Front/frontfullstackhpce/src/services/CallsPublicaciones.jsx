// Servicio para operaciones CRUD de publicaciones. Permite obtener, crear, actualizar y eliminar publicaciones mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de publicaciones (requiere autenticación JWT).
 * Realiza una petición GET a /publicaciones/ y retorna el array de publicaciones.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de publicaciones
 */
async function GetPublicaciones() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}publicaciones/`, {
      method: 'GET',
    }, 'publicaciones');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching publicaciones:', error);
    throw error;
  }
}



/**
 * Crea una nueva publicación.
 * Realiza una petición POST a /publicaciones/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos de la publicación
 * @returns {Promise<Object>} - Publicación creada
 */
async function PostPublicaciones(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}publicaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'publicaciones');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting publicacion:', error);
    throw error;
  }
}



/**
 * Actualiza una publicación existente.
 * Realiza una petición PUT a /publicaciones/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la publicación a actualizar
 * @param {Object} objeto - Nuevos datos de la publicación
 * @returns {Promise<Object>} - Publicación actualizada
 */
async function UpdatePublicaciones(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}publicaciones/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'publicaciones');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating publicacion:', error);
    throw error;
  }
}



/**
 * Elimina una publicación por su ID.
 * Realiza una petición DELETE a /publicaciones/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la publicación a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeletePublicaciones(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}publicaciones/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'publicaciones');
    if (!response.ok) throw new Error(`Error deleting publicacion with id ${id}`);
    return { message: `Publicacion con id ${id} eliminada correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting publicacion:', error);
    throw error;
  }
}



// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetPublicaciones, PostPublicaciones, UpdatePublicaciones, DeletePublicaciones };