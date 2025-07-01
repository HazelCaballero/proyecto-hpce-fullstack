// Servicio para operaciones CRUD de interacciones en publicaciones. Permite obtener, crear, actualizar y eliminar interacciones mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = "http://127.0.0.1:8000/api/";



/**
 * Obtiene la lista de interacciones en publicaciones (requiere autenticación JWT).
 * Realiza una petición GET a /interacciones-publicacion/ y retorna el array de interacciones.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de interacciones
 */
async function GetInterPublicacion() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/`, {
      method: 'GET',
    }, 'interacciones-publicacion');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching interPublicacions:', error);
    throw error;
  }
}



/**
 * Crea una nueva interacción en publicación.
 * Realiza una petición POST a /interacciones-publicacion/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos de la interacción
 * @returns {Promise<Object>} - Interacción creada
 */
async function PostInterPublicacion(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-publicacion');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting interPublicacion:', error);
    throw error;
  }
}



/**
 * Actualiza una interacción en publicación existente.
 * Realiza una petición PUT a /interacciones-publicacion/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la interacción a actualizar
 * @param {Object} objeto - Nuevos datos de la interacción
 * @returns {Promise<Object>} - Interacción actualizada
 */
async function UpdateInterPublicacion(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-publicacion');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating interPublicacion:', error);
    throw error;
  }
}



/**
 * Elimina una interacción en publicación por su ID.
 * Realiza una petición DELETE a /interacciones-publicacion/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la interacción a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteInterPublicacion(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-publicacion');
    if (!response.ok) throw new Error(`Error deleting interPublicacion with id ${id}`);
    return { message: `Interacción con id ${id} eliminada correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting interPublicacion:', error);
    throw error;
  }
}



// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetInterPublicacion, PostInterPublicacion, UpdateInterPublicacion, DeleteInterPublicacion };