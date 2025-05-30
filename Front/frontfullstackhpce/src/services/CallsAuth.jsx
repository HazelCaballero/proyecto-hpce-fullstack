const BASE_URL = "http://127.0.0.1:8000/api/";

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
