import { fetchWithAuth } from './fetchWithAuth';

// Servicio para operaciones CRUD de interacciones en publicaciones
const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de interacciones en publicaciones (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de interacciones
 */
async function GetInterPublicacion() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/`, {
      method: 'GET',
    }, 'interacciones-publicacion');
    return await response.json();
  } catch (error) {
    console.error('Error fetching interPublicacions:', error);
    throw error;
  }
}


/**
 * Crea una nueva interacción en publicación.
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
    console.error('Error posting interPublicacion:', error);
    throw error;
  }
}


async function UpdateInterPublicacion(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-publicacion');
    return await response.json();
  } catch (error) {
    console.error('Error updating interPublicacion:', error);
    throw error;
  }
}


async function DeleteInterPublicacion(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-publicacion/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-publicacion');
    if (!response.ok) throw new Error(`Error deleting interPublicacion with id ${id}`);
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting interPublicacion:', error);
    throw error;
  }
}


export default { GetInterPublicacion, PostInterPublicacion, UpdateInterPublicacion, DeleteInterPublicacion };