// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetPublicidad() {
  try {
 
    const response = await fetch(`${BASE_URL}publicidades/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (!response.ok) throw new Error('Error fetching publicidad');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching publicidad:', error);
    throw error;
  }
}


async function PostPublicidad(objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}publicidades/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting publicidad');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting publicidad:', error);
    throw error;
  }
}


async function UpdatePublicidad(id, objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}publicidades/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
   
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating publicidad with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating publicidad:', error);
    throw error;
  }
}


async function DeletePublicidad(id) {
  try {
 
    const response = await fetch(`${BASE_URL}publicidades/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
 
    if (!response.ok) throw new Error(`Error deleting publicidad with id ${id}`);
 
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting publicidad:', error);
    throw error;
  }
}


export default { GetPublicidad, PostPublicidad, UpdatePublicidad, DeletePublicidad };