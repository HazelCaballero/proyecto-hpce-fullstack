import { buildHeaders, handleFetchError } from './utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Obtiene la información del superusuario (requiere autenticación JWT).
 * @returns {Promise<Object>} - Datos del superusuario
 */
async function GetSuperUser() {
  try {
    const response = await fetch(`${BASE_URL}ver-superusuario/`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


/**
 * Crea un nuevo superusuario.
 * @param {Object} objeto - Datos del superusuario
 * @returns {Promise<Object>} - Superusuario creado
 */
async function PostSuperUser(objeto) {
  try {
    const response = await fetch(`${BASE_URL}crear-superusuario/`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


async function UpdateSuperUser(id, objeto) {
  try {
    const response = await fetch(`${BASE_URL}actualizar-superusuario/${id}/`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(objeto)
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return await response.json();
  } catch (error) {
    throw error;
  }
}


async function DeleteSuperUser(id) {
  try {
    const response = await fetch(`${BASE_URL}eliminar-superusuario/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) await handleFetchError(response, 'superuser');
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
}


export default { GetSuperUser, PostSuperUser, UpdateSuperUser, DeleteSuperUser };
