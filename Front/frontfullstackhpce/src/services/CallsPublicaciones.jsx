// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetPublicaciones() {
  try {
 
    const response = await fetch(`${BASE_URL}publicaciones/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (!response.ok) throw new Error('Error fetching publicaciones');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching publicaciones:', error);
    throw error;
  }
}


async function PostPublicaciones(objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}publicaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting publicacion');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting publicacion:', error);
    throw error;
  }
}


async function UpdatePublicaciones(id, objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}publicaciones/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
   
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating publicacion with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating publicacion:', error);
    throw error;
  }
}


async function DeletePublicaciones(id) {
  try {
 
    const response = await fetch(`${BASE_URL}publicaciones/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
 
    if (!response.ok) throw new Error(`Error deleting publicacion with id ${id}`);
 
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting publicacion:', error);
    throw error;
  }
}


export default { GetPublicaciones, PostPublicaciones, UpdatePublicaciones, DeletePublicaciones };