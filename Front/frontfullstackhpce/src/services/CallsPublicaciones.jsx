// Servicio para operaciones CRUD de publicaciones
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Obtiene la lista de publicaciones (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de publicaciones
 */
async function GetPublicaciones() {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicaciones/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
  
    if (!response.ok) throw new Error('Error fetching publicaciones');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching publicaciones:', error);
    throw error;
  }
}


/**
 * Crea una nueva publicación.
 * @param {Object} objeto - Datos de la publicación
 * @returns {Promise<Object>} - Publicación creada
 */
async function PostPublicaciones(objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicaciones/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting publicacion');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting publicacion:', error);
    throw error;
  }
}


async function UpdatePublicaciones(id, objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicaciones/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating publicacion with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating publicacion:', error);
    throw error;
  }
}


async function DeletePublicaciones(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicaciones/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error(`Error deleting publicacion with id ${id}`);
    return { message: `Publicacion with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting publicacion:', error);
    throw error;
  }
}


export default { GetPublicaciones, PostPublicaciones, UpdatePublicaciones, DeletePublicaciones };