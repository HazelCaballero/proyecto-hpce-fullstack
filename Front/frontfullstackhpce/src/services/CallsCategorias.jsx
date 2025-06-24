import { fetchWithAuth } from './fetchWithAuth';

// Servicio para operaciones CRUD de categorías
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Obtiene la lista de categorías (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de categorías
 */
async function GetCategorias() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}categorias/`, {
      method: 'GET',
    }, 'categorias');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Crea una nueva categoría.
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
    console.error('Error posting categorie:', error);
    throw error;
  }
}

/**
 * Elimina una categoría por ID. Si hay trueques asociados, pregunta antes de forzar el borrado.
 * @param {number} id - ID de la categoría
 * @param {boolean} force - Si es true, fuerza el borrado y elimina trueques asociados
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
    throw error;
  }
}

export default { GetCategorias, PostCategorias, DeleteCategorias };
