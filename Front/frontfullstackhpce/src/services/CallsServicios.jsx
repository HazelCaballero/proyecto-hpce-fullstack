// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetServicios() {
  try {
 
    const response = await fetch(`${BASE_URL}servicios/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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
   
    const response = await fetch(`${BASE_URL}servicios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting servicio');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting servicio:', error);
    throw error;
  }
}


async function UpdateServicios(id, objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}servicios/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
   
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


export default { GetServicios, PostServicios, UpdateServicios, DeleteServicios };