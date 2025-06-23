import { fetchWithAuth } from './fetchWithAuth';

// Servicio para operaciones CRUD de contactos
const BASE_URL = "http://127.0.0.1:8000/api/";


/**
 * Obtiene la lista de contactos (requiere autenticación JWT).
 * @returns {Promise<Array>} - Lista de contactos
 */
async function GetContactos() {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/`, {
      method: 'GET',
    }, 'contactos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching contactos:', error);
    throw error;
  }
}


/**
 * Crea un nuevo contacto.
 * @param {Object} objeto - Datos del contacto
 * @returns {Promise<Object>} - Contacto creado
 */
async function PostContactos(objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'contactos');
    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Error posting contacto');
      error.backend = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error posting contacto:', error);
    throw error;
  }
}


async function UpdateContactos(id, objeto) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    }, 'contactos');
    return await response.json();
  } catch (error) {
    console.error('Error updating contacto:', error);
    throw error;
  }
}


async function DeleteContacto(id) {
  try {
    const response = await fetchWithAuth(`${BASE_URL}contactos/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, 'contactos');
    if (!response.ok) throw new Error(`Error deleting contacto with id ${id}`);
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting contacto:', error);
    throw error;
  }
}


export default { GetContactos, PostContactos, UpdateContactos, DeleteContacto };