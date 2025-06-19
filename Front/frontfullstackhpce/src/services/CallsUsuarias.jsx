// Servicio para operaciones CRUD de usuarias
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Obtiene la lista de usuarias (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de usuarias
 */
async function GetUsuarias() {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Crea una nueva usuaria.
 * @param {Object} objeto - Datos de la usuaria
 * @returns {Promise<Object>} - Usuaria creada
 */
async function PostUsuarias(objeto) {
  try {
    const response = await fetch(`${BASE_URL}usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    });
    if (!response.ok) {
      // Intentar extraer el mensaje de error del backend
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      const error = new Error('Error posting user');
      error.response = { data: errorData };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting user:', error);
    throw error;
  }
}

/**
 * Actualiza los datos de una usuaria existente.
 * @param {number} id - ID de la usuaria
 * @param {Object} objeto - Nuevos datos de la usuaria
 * @returns {Promise<Object>} - Usuaria actualizada
 */
async function UpdateUsuarias(id, objeto) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    if (!response.ok) throw new Error(`Error updating user with id ${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Elimina una usuaria por su ID.
 * @param {number} id - ID de la usuaria
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteUsuarias(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error(`Error deleting user with id ${id}`);
    return { message: `User with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Obtiene los datos de una usuaria por su ID.
 * @param {number} id - ID de la usuaria
 * @returns {Promise<Object>} - Datos de la usuaria
 */
async function GetUsuaria(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Asigna un rol a una usuaria.
 * @param {number} id - ID de la usuaria
 * @param {string} rol - Nuevo rol para la usuaria
 * @returns {Promise<Object>} - Usuaria con el rol actualizado
 */
async function AsignarRolUsuaria(id, rol) {
  const token = localStorage.getItem('access');
  const response = await fetch(`${BASE_URL}asignar-rol-usuaria/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    },
    body: JSON.stringify({ rol })
  });
  if (!response.ok) throw new Error('Error asignando rol');
  return await response.json();
}

export default { GetUsuarias, GetUsuaria, PostUsuarias, UpdateUsuarias, DeleteUsuarias, AsignarRolUsuaria };
