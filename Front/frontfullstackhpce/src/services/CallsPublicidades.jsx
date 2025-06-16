// Servicio para operaciones CRUD de publicidades
const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de publicidades (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de publicidades
 */
async function GetPublicidad() {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicidades/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
  
    if (!response.ok) throw new Error('Error fetching publicidad');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching publicidad:', error);
    throw error;
  }
}


/**
 * Crea una nueva publicidad.
 * @param {Object} objeto - Datos de la publicidad
 * @returns {Promise<Object>} - Publicidad creada
 */
async function PostPublicidad(objeto) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicidades/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });

    const data = await response.json();
    if (!response.ok) {
      // Lanza el error con el mensaje del backend
      throw new Error(JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error('Error posting publicidad:', error);
    throw error;
  }
}


async function UpdatePublicidad(id, objeto) {
  try {
    const token = localStorage.getItem('access');
    console.log('Token usado para PUT:', token);
    const response = await fetch(`${BASE_URL}publicidades/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    if (!response.ok) throw new Error(`Error updating publicidad with id ${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating publicidad:', error);
    throw error;
  }
}


async function DeletePublicidad(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}publicidades/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });

    if (!response.ok) throw new Error(`Error deleting publicidad with id ${id}`);

    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting publicidad:', error);
    throw error;
  }
}


export default { GetPublicidad, PostPublicidad, UpdatePublicidad, DeletePublicidad };