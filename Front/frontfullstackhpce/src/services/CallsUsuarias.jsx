const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetUsuarias() {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
   
    if (!response.ok) throw new Error('Error fetching users');
    
    return await response.json();
  } catch (error) {
   
    console.error('Error fetching users:', error);
    throw error;
  }
}


async function PostUsuarias(objeto) {
  try {
 
    const response = await fetch(`${BASE_URL}usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
     
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error('Error posting user');
    
    return await response.json();
  } catch (error) {
    
    console.error('Error posting user:', error);
    throw error;
  }
}


async function UpdateUsuarias(id, objeto) {
  try {
  
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating user with id ${id}`);
   
    return await response.json();
  } catch (error) {
    
    console.error('Error updating user:', error);
    throw error;
  }
}


async function DeleteUsuarias(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error(`Error deleting user with id ${id}`);
    return { message: `User with id ${id} deleted successfully` };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


async function GetUsuaria(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}


async function AsignarRolUsuaria(id, rol) {
  const token = localStorage.getItem('access');
  const response = await fetch(`${BASE_URL}asignar-rol-usuaria/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    },
    body: JSON.stringify({ rol })
  });
  if (!response.ok) throw new Error('Error asignando rol');
  return await response.json();
}


export default { GetUsuarias, GetUsuaria, PostUsuarias, UpdateUsuarias, DeleteUsuarias, AsignarRolUsuaria };
