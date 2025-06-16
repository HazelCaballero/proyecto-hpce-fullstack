// Servicio de autenticación para login de usuarias
// Realiza la petición al endpoint /token/ del backend para obtener el JWT
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Inicia sesión con usuario y contraseña.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Respuesta con tokens JWT
 */
async function login(username, password) {
  try {
    const response = await fetch(`${BASE_URL}token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export default { login };
