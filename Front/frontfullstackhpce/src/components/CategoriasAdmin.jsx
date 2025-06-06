import React, { useEffect, useState } from 'react';
import CallsCategorias from '../services/CallsCategorias';

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [catForm, setCatForm] = useState({ nombre: '' });
  const [editCatId, setEditCatId] = useState(null);

  const cargarDatos = () => {
    CallsCategorias.GetCategorias().then(setCategorias).catch(() => setCategorias([]));
  };
  useEffect(() => { cargarDatos(); }, []);

  const handleCatChange = e => setCatForm({ ...catForm, [e.target.name]: e.target.value });
  const handleCatSubmit = async e => {
    e.preventDefault();
    if (editCatId) {
      await CallsCategorias.UpdateCategorias(editCatId, catForm);
    } else {
      await CallsCategorias.PostCategorias(catForm);
    }
    setCatForm({ nombre: '' });
    setEditCatId(null);
    cargarDatos();
  };
  const handleCatEdit = c => { setCatForm(c); setEditCatId(c.id); };
  const handleCatDelete = async id => { if(window.confirm('¿Eliminar categoría?')) { await CallsCategorias.DeleteCategorias(id); cargarDatos(); } };

  return (
    <div>
      <h3>Categorías</h3>
      <form onSubmit={handleCatSubmit} style={{marginBottom:12}}>
        <input name="nombre" value={catForm.nombre} onChange={handleCatChange} placeholder="Nombre" required /> <br />
        <button type="submit">{editCatId ? 'Actualizar' : 'Crear'} Categoría</button>
        {editCatId && <button type="button" onClick={()=>{setEditCatId(null);setCatForm({nombre:''})}}>Cancelar</button>}
      </form>
      <ul>
        {categorias.map(c => (
          <li key={c.id}>
            {c.nombre}
            <button onClick={()=>handleCatEdit(c)} style={{marginLeft:8}}>Editar</button>
            <button onClick={()=>handleCatDelete(c.id)} style={{marginLeft:4}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
