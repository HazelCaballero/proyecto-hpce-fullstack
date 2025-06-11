const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetCategorias() {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}categorias/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
   
    if (!response.ok) throw new Error('Error fetching categories');
    
    return await response.json();
  } catch (error) {
   
    console.error('Error fetching categories:', error);
    throw error;
  }
}


async function PostCategorias(objeto) {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}categorias/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error('Error posting categorie');
    
    return await response.json();
  } catch (error) {
    
    console.error('Error posting categorie:', error);
    throw error;
  }
}


async function UpdateCategorias(id, objeto) {
  try {
  
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}categorias/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating categorie with id ${id}`);
   
    return await response.json();
  } catch (error) {
    
    console.error('Error updating categorie:', error);
    throw error;
  }
}


async function DeleteCategorias(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}categorias/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    
    if (!response.ok) throw new Error(`Error deleting categorie with id ${id}`);

    return { message: `User with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting categorie:', error);
    throw error;
  }
}


export default { GetCategorias, PostCategorias, UpdateCategorias, DeleteCategorias };
