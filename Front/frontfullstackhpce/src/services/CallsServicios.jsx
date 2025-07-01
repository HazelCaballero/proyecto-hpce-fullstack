// Servicio para operaciones CRUD de servicios. Permite obtener, crear, actualizar, eliminar y consultar servicios mediante la API.
// Cada función está documentada con su propósito, parámetros y valor de retorno para facilitar el mantenimiento y la colaboración.
const BASE_URL = "http://127.0.0.1:8000/api/";



/**
 * Obtiene la lista de servicios (requiere autenticación JWT).
 * Realiza una petición GET a /servicios/ y retorna el array de servicios.
 * Si ocurre un error, lo lanza para manejo externo.
 * @returns {Promise<Array>} - Lista de servicios
 */
async function GetServicios() {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}servicios/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching servicios');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching servicios:', error);
    throw error;
  }
}



/**
 * Crea un nuevo servicio.
 * Realiza una petición POST a /servicios/ con los datos proporcionados.
 * Si la respuesta no es exitosa, intenta extraer el mensaje de error del backend y lo adjunta al error lanzado.
 * @param {Object} objeto - Datos del servicio
 * @returns {Promise<Object>} - Servicio creado
 */
async function PostServicios(objeto) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}servicios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Detalles del error:', JSON.stringify(errorData, null, 2));
      throw new Error('Error posting servicio');
    }
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error posting servicio:', error);
    throw error;
  }
}



/**
 * Actualiza un servicio existente.
 * Realiza una petición PUT a /servicios/:id/ con los nuevos datos.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del servicio a actualizar
 * @param {Object} objeto - Nuevos datos del servicio
 * @returns {Promise<Object>} - Servicio actualizado
 */
async function UpdateServicios(id, objeto) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}servicios/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    if (!response.ok) throw new Error(`Error updating servicio with id ${id}`);
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error updating servicio:', error);
    throw error;
  }
}



/**
 * Elimina un servicio por su ID.
 * Realiza una petición DELETE a /servicios/:id/.
 * Si la respuesta no es exitosa, maneja el error con detalles del backend.
 * @param {number} id - ID del servicio a eliminar
 * @returns {Promise<Object>} - Mensaje de éxito
 */
async function DeleteServicios(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}servicios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error(`Error deleting servicio with id ${id}`);
    return { message: `Servicio con id ${id} eliminado correctamente` };
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error deleting servicio:', error);
    throw error;
  }
}



/**
 * Obtiene los datos de un servicio por su ID.
 * Realiza una petición GET a /servicios/:id/.
 * Si ocurre un error, lo lanza para manejo externo.
 * @param {number} id - ID del servicio
 * @returns {Promise<Object>} - Datos del servicio
 */
async function GetServicio(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}servicios/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching servicio');
    return await response.json();
  } catch (error) {
    // Loguea y propaga el error para manejo en la UI
    console.error('Error fetching servicio:', error);
    throw error;
  }
}


// Exporta todas las funciones CRUD y de consulta para ser usadas en otros módulos.
// Esto permite importar el servicio completo o funciones individuales según necesidad.
export default { GetServicios, PostServicios, UpdateServicios, DeleteServicios, GetServicio };