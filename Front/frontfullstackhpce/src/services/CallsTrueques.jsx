const BASE_URL = "http://127.0.0.1:8000/api/";


async function GetTrueques() {
  try {
    
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
   
    if (!response.ok) throw new Error('Error fetching trueques');
   
    return await response.json();
  } catch (error) {
  
    console.error('Error fetching trueques:', error);
    throw error;
  }
}


async function PostTrueques(objeto) {
  try {
   
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
   
    if (!response.ok) throw new Error('Error posting trueque');
  
    return await response.json();
  } catch (error) {
   
    console.error('Error posting trueque:', error);
    throw error;
  }
}


async function UpdateTrueques(id, objeto) {
  try {
 
    const token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(objeto)
    });
    
    if (!response.ok) throw new Error(`Error updating trueque with id ${id}`);
    
    return await response.json();
  } catch (error) {
   
    console.error('Error updating trueque:', error);
    throw error;
  }
}


async function DeleteTrueque(id) {
  try {
    
    const response = await fetch(`${BASE_URL}trueques/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Error deleting trueque with id ${id}`);
   
    return { message: `Employe with id ${id} deleted successfully` };
  } catch (error) {
    
    console.error('Error deleting trueque:', error);
    throw error;
  }
}


export default { GetTrueques, PostTrueques, UpdateTrueques, DeleteTrueque };
