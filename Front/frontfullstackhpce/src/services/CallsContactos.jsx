const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetContactos() {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}contactos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
  
    if (!response.ok) throw new Error('Error fetching contactos');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching contactos:', error);
    throw error;
  }
}


async function PostContactos(objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}contactos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting contacto');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting contacto:', error);
    throw error;
  }
}


async function UpdateContactos(id, objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}contactos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating contacto with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating contacto:', error);
    throw error;
  }
}


async function DeleteContacto(id) {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}contactos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
 
    if (!response.ok) throw new Error(`Error deleting contacto with id ${id}`);
 
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting contacto:', error);
    throw error;
  }
}


export default { GetContactos, PostContactos, UpdateContactos, DeleteContacto };