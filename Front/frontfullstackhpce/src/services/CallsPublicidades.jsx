// Servicio para operaciones CRUD de publicidades. Permite obtener, crear, actualizar y eliminar publicidades mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
const BASE_URL = "http://127.0.0.1:8000/api/";



/**
 * Obtiene la lista de publicidades (requiere autenticación JWT).
 * Realiza una petición GET a /publicidades/ y retorna el array de publicidades.
 * Si ocurre un error, lo lanza para manejo externo.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching publicidad:', error);
    throw error;
  }
}



/**
 * Crea una nueva publicidad.
 * Realiza una petición POST a /publicidades/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting publicidad:', error);
    throw error;
  }
}



/**
 * Actualiza una publicidad existente.
 * Realiza una petición PUT a /publicidades/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la publicidad a actualizar
 * @param {Object} objeto - Nuevos datos de la publicidad
 * @returns {Promise<Object>} - Publicidad actualizada
 */
async function UpdatePublicidad(id, objeto) {
  try {
    const token = localStorage.getItem('access');
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
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating publicidad:', error);
    throw error;
  }
}



/**
 * Elimina una publicidad por su ID.
 * Realiza una petición DELETE a /publicidades/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID de la publicidad a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
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
    return { message: `Publicidad con id ${id} eliminada correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting publicidad:', error);
    throw error;
  }
}



// Exporta todas las funciones CRUD para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetPublicidad, PostPublicidad, UpdatePublicidad, DeletePublicidad };