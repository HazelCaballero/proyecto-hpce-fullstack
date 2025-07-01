// Servicio para operaciones CRUD de usuarias. Incluye funciones para obtener, crear, actualizar, eliminar y asignar roles a usuarias.
// Todas las funciones gestionan el token JWT automáticamente desde localStorage.
//
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de usuarias (requiere autenticación JWT).
 * Realiza una petición GET a /usuarios/ y retorna el array de usuarias.
 * Si ocurre un error, lo lanza para manejo externo.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching users:', error);
    throw error;
  }
}


/**
 * Crea una nueva usuaria en el sistema.
 * Realiza una petición POST a /usuarios/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
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
      // Intentar extraer el mensaje de error del backend para mayor claridad
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting user:', error);
    throw error;
  }
}


/**
 * Actualiza los datos de una usuaria existente.
 * Realiza una petición PATCH a /usuarios/:id/ con los nuevos datos.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating user:', error);
    throw error;
  }
}


/**
 * Elimina una usuaria por su ID.
 * Realiza una petición DELETE a /usuarios/:id/.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting user:', error);
    throw error;
  }
}


/**
 * Obtiene los datos de una usuaria por su ID.
 * Realiza una petición GET a /usuarios/:id/.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching user:', error);
    throw error;
  }
}


/**
 * Asigna un rol a una usuaria específica.
 * Realiza una petición PATCH a /asignar-rol-usuaria/:id/ con el nuevo rol.
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



// Exporta todas las funciones CRUD y de asignación de rol para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetUsuarias, GetUsuaria, PostUsuarias, UpdateUsuarias, DeleteUsuarias, AsignarRolUsuaria };
