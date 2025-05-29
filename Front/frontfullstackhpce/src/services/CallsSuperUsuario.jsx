// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetSuperUser() {
  try {
 
    const response = await fetch(`${BASE_URL}ver-superusuario/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (!response.ok) throw new Error('Error fetching employes');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching employes:', error);
    throw error;
  }
}


async function PostSuperUser(objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}crear-superusuario/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting employe');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting employe:', error);
    throw error;
  }
}


async function UpdateSuperUser(id, objeto) {
  try {
   
    const response = await fetch(`${BASE_URL}actualizar-superusuario/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
   
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating employe with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating employe:', error);
    throw error;
  }
}


async function DeleteSuperUser(id) {
  try {
 
    const response = await fetch(`${BASE_URL}eliminar-superusuario/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
 
    if (!response.ok) throw new Error(`Error deleting employe with id ${id}`);
 
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting employe:', error);
    throw error;
  }
}


export default { GetSuperUser, PostSuperUser, UpdateSuperUser, DeleteSuperUser };
