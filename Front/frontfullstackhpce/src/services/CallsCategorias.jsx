// Servicio para operaciones CRUD de categorías. Permite obtener, crear y eliminar categorías mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de categorías (requiere autenticación JWT).
 * Realiza una petición GET a /categorias/ y retorna el array de categorías.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de categorías
 */
async function GetCategorias() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}categorias/`, {
      method: 'GET',
    }, 'categorias');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching categories:', error);
    throw error;
  }
}


/**
 * Crea una nueva categoría.
 * Realiza una petición POST a /categorias/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos de la categoría
 * @returns {Promise<Object>} - Categoría creada
 */
async function PostCategorias(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}categorias/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'categorias');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting categorie:', error);
    throw error;
  }
}


/**
 * Elimina una categoría por ID. Si hay trueques asociados, pregunta antes de forzar el borrado.
 * Realiza una petición DELETE a /categorias/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la categoría
 * @param {boolean} force - Si es true, fuerza el borrado y elimina trueques asociados
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
async function DeleteCategorias(id, force = true) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}categorias/${id}/` + (force ? '?force=true' : ''), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'categorias');
    if (response.status === 409) {
      const data = await response.json();
      throw { type: 'confirm', detail: data.detail };
    }
    if (!response.ok) throw new Error('Error deleting category');
    return true;
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    throw error;
  }
}


// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetCategorias, PostCategorias, DeleteCategorias };
