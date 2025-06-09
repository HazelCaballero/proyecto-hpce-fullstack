// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


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

    console.error('Error fetching servicios:', error);
    throw error;
  }
}


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
      console.error('Detalles del error:', JSON.stringify(errorData, null, 2)); // <-- Así verás el error real
      throw new Error('Error posting servicio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting servicio:', error);
    throw error;
  }
}


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
   
    console.error('Error updating servicio:', error);
    throw error;
  }
}


async function DeleteServicios(id) {
  try {
 
    const response = await fetch(`${BASE_URL}servicios/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
 
    if (!response.ok) throw new Error(`Error deleting servicio with id ${id}`);
 
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting servicio:', error);
    throw error;
  }
}


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
    console.error('Error fetching servicio:', error);
    throw error;
  }
}

export default { GetServicios, PostServicios, UpdateServicios, DeleteServicios, GetServicio };