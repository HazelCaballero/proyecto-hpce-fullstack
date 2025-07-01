// Servicio para operaciones CRUD de contactos. Permite obtener, crear, actualizar y eliminar contactos mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = "http://127.0.0.1:8000/api/";



/**
 * Obtiene la lista de contactos (requiere autenticación JWT).
 * Realiza una petición GET a /contactos/ y retorna el array de contactos.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de contactos
 */
async function GetContactos() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/`, {
      method: 'GET',
    }, 'contactos');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching contactos:', error);
    throw error;
  }
}



/**
 * Crea un nuevo contacto.
 * Realiza una petición POST a /contactos/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos del contacto
 * @returns {Promise<Object>} - Contacto creado
 */
async function PostContactos(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'contactos');
    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Error posting contacto');
      error.backend = data;
      throw error;
    }
    return data;
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting contacto:', error);
    throw error;
  }
}



/**
 * Actualiza un contacto existente.
 * Realiza una petición PUT a /contactos/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del contacto a actualizar
 * @param {Object} objeto - Nuevos datos del contacto
 * @returns {Promise<Object>} - Contacto actualizado
 */
async function UpdateContactos(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'contactos');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating contacto:', error);
    throw error;
  }
}



/**
 * Elimina un contacto por su ID.
 * Realiza una petición DELETE a /contactos/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del contacto a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteContacto(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'contactos');
    if (!response.ok) throw new Error(`Error deleting contacto with id ${id}`);
    return { message: `Contacto con id ${id} eliminado correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting contacto:', error);
    throw error;
  }
}



// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetContactos, PostContactos, UpdateContactos, DeleteContacto };