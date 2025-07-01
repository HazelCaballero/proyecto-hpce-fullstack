// Servicio para operaciones CRUD de interacciones en trueques. Permite obtener, crear, actualizar, eliminar y consultar interacciones mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de interacciones en trueques (requiere autenticación JWT).
 * Realiza una petición GET a /interacciones-trueque/ y retorna el array de interacciones.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de interacciones
 */
async function GetInterTrueques() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/`, {
      method: 'GET',
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching interTrueques:', error);
    throw error;
  }
}



/**
 * Crea una nueva interacción en trueque.
 * Realiza una petición POST a /interacciones-trueque/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos de la interacción
 * @returns {Promise<Object>} - Interacción creada
 */
async function PostInterTrueques(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting interTrueque:', error);
    throw error;
  }
}



/**
 * Actualiza una interacción en trueque existente.
 * Realiza una petición PUT a /interacciones-trueque/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la interacción a actualizar
 * @param {Object} objeto - Nuevos datos de la interacción
 * @returns {Promise<Object>} - Interacción actualizada
 */
async function UpdateInterTrueques(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating interTrueque:', error);
    throw error;
  }
}



/**
 * Elimina una interacción en trueque por su ID.
 * Realiza una petición DELETE a /interacciones-trueque/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la interacción a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteInterTrueques(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-trueque');
    if (!response.ok) throw new Error(`Error deleting interTrueque with id ${id}`);
    return { message: `Interacción con id ${id} eliminada correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting interTrueque:', error);
    throw error;
  }
}



/**
 * Obtiene las interacciones de trueque asociadas a un trueque específico.
 * Realiza una petición GET a /interacciones-trueque/?trueque=:id.
 * Si ocurre un error, lo lanza para manejo externo.
 * @param {number} truequeId - ID del trueque
 * @returns {Promise<Array>} - Lista de interacciones asociadas
 */
async function GetInterTruequesPorTrueque(truequeId) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/?trueque=${truequeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-trueque');
    if (!response.ok) throw new Error('Error fetching interTrueques por trueque');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching interTrueques por trueque:', error);
    throw error;
  }
}


// Exporta todas las funciones CRUD y de consulta para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { 
  GetInterTrueques, 
  PostInterTrueques, 
  UpdateInterTrueques, 
  DeleteInterTrueques,
  GetInterTruequesPorTrueque 
};