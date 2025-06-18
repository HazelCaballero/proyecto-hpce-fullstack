import React, { useEffect, useState } from 'react';
import CallsCategorias from '../services/CallsCategorias';
import Swal from 'sweetalert2';
import '../styles/Scomponents/CategoriasAdmin.css';

/**
 * Componente de administración de categorías.
 * Permite ver, crear, editar y eliminar categorías.
 */
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
  // Edición con SweetAlert2
  const handleCatEdit = async (c) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar categoría',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${c.nombre || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value
        ];
      }
    });
    if (formValues) {
      const [nombre] = formValues;
      if (!nombre.trim()) {
        Swal.fire('Error', 'El nombre es obligatorio.', 'error');
        return;
      }
      try {
        await CallsCategorias.UpdateCategorias(c.id, { nombre });
        Swal.fire('Actualizado', 'La categoría ha sido actualizada.', 'success');
        cargarDatos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
      }
    }
  };
  const handleCatDelete = async id => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la categoría de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await CallsCategorias.DeleteCategorias(id);
      Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
      cargarDatos();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
    }
  };

  return (
    <div>
      <h3>Categorías</h3>
      <form onSubmit={handleCatSubmit} className="categorias-form">
        <input name="nombre" value={catForm.nombre} onChange={handleCatChange} placeholder="Nombre" required /> <br />
        <button type="submit">{editCatId ? 'Actualizar' : 'Crear'} Categoría</button>
        {editCatId && <button type="button" onClick={()=>{setEditCatId(null);setCatForm({nombre:''})}}>Cancelar</button>}
      </form>
      <ul>
        {categorias.map(c => (
          <li key={c.id}>
            {c.nombre}
            <button onClick={()=>handleCatEdit(c)} className="categorias-btn-edit">Editar</button>
            <button onClick={()=>handleCatDelete(c.id)} className="categorias-btn-delete">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
