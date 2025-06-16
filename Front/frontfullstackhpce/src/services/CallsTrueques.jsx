// Servicio para operaciones CRUD de trueques
const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de trueques (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de trueques
 */
async function GetTrueques() {
  try {
    
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
   
    if (!response.ok) throw new Error('Error fetching trueques');
   
    return await response.json();
  } catch (error) {
  
    console.error('Error fetching trueques:', error);
    throw error;
  }
}


/**
 * Crea un nuevo trueque.
 * @param {Object} objeto - Datos del trueque
 * @returns {Promise<Object>} - Trueque creado
 */
async function PostTrueques(objeto) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Detalle del error backend:', errorText); // <-- AGREGA ESTA LÍNEA
      throw new Error('Error posting trueque');
    }

    return await response.json();
  } catch (error) {
   
    console.error('Error posting trueque:', error);
    throw error;
  }
}


/**
 * Actualiza un trueque existente.
 * @param {number} id - ID del trueque a actualizar
 * @param {Object} objeto - Nuevos datos del trueque
 * @returns {Promise<Object>} - Trueque actualizado
 */
async function UpdateTrueques(id, objeto) {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error(`Error updating trueque with id ${id}`);
    
    return await response.json();
  } catch (error) {
   
    console.error('Error updating trueque:', error);
    throw error;
  }
}


/**
 * Elimina un trueque.
 * @param {number} id - ID del trueque a eliminar
 * @returns {Promise<void>}
 */
async function DeleteTrueque(id) {
  try {
    
    const token = localStorage.getItem('access')
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Error deleting trueque with id ${id}`)
    }
  } catch (error) {
    
    console.error('Error deleting trueque:', error);
    throw error;
  }
}


export default { GetTrueques, PostTrueques, UpdateTrueques, DeleteTrueque };
