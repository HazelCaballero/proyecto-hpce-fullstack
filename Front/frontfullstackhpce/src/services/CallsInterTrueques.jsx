// URL base de la API donde se hacen las peticiones
const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetInterTrueques() {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}interacciones-trueque/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
  
    if (!response.ok) throw new Error('Error fetching interTrueques');
  
    return await response.json();
  } catch (error) {

    console.error('Error fetching interTrueques:', error);
    throw error;
  }
}


async function PostInterTrueques(objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}interacciones-trueque/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error('Error posting interTrueque');
 
    return await response.json();
  } catch (error) {
   
    console.error('Error posting interTrueque:', error);
    throw error;
  }
}


async function UpdateInterTrueques(id, objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error(`Error updating interTrueque with id ${id}`);
   
    return await response.json();
  } catch (error) {
   
    console.error('Error updating interTrueque:', error);
    throw error;
  }
}


async function DeleteInterTrueques(id) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}interacciones-trueque/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });

    if (!response.ok) throw new Error(`Error deleting interTrueque with id ${id}`);

    return { message: `Interaccion with id ${id} deleted successfully` };
  } catch (error) {

    console.error('Error deleting interTrueque:', error);
    throw error;
  }
}


async function GetInterTruequesPorTrueque(truequeId) {
  try {
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}interacciones-trueque/?trueque=${truequeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!response.ok) throw new Error('Error fetching interTrueques por trueque');
    return await response.json();
  } catch (error) {
    console.error('Error fetching interTrueques por trueque:', error);
    throw error;
  }
}

export default { 
  GetInterTrueques, 
  PostInterTrueques, 
  UpdateInterTrueques, 
  DeleteInterTrueques,
  GetInterTruequesPorTrueque 
};