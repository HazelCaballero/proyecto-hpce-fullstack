import { fetchWithAuth } from './fetchWithAuth';

// Servicio para operaciones CRUD de interacciones en trueques
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Obtiene la lista de interacciones en trueques (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de interacciones
 */
async function GetInterTrueques() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/`, {
      method: 'GET',
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    console.error('Error fetching interTrueques:', error);
    throw error;
  }
}


/**
 * Crea una nueva interacción en trueque.
 * @param {Object} objeto - Datos de la interacción
 * @returns {Promise<Object>} - Interacción creada
 */
async function PostInterTrueques(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    console.error('Error posting interTrueque:', error);
    throw error;
  }
}


async function UpdateInterTrueques(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'interacciones-trueque');
    return await response.json();
  } catch (error) {
    console.error('Error updating interTrueque:', error);
    throw error;
  }
}


async function DeleteInterTrueques(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-trueque');
    if (!response.ok) throw new Error(`Error deleting interTrueque with id ${id}`);
    return { message: `Interaccion with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting interTrueque:', error);
    throw error;
  }
}


async function GetInterTruequesPorTrueque(truequeId) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}interacciones-trueque/?trueque=${truequeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, 'interacciones-trueque');
    if (!response.ok) throw new Error('Error fetching interTrueques por trueque');
    return await response.json();
  } catch (error) {
    console.error('Error fetching interTrueques por trueque:', error);
    throw error;
  }
}

export default { 
  GetInterTrueques, 
  PostInterTrueques, 
  UpdateInterTrueques, 
  DeleteInterTrueques,
  GetInterTruequesPorTrueque 
};