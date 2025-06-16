import React, { useEffect, useState } from 'react'
import CallsTrueques from '../services/CallsTrueques'
import CallsCategorias from '../services/CallsCategorias'
import Swal from 'sweetalert2'
import '../styles/Scomponents/ATrueques.css'

/**
 * Componente de administración de trueques.
 * Permite ver, crear, editar y eliminar trueques y categorías.
 */
export default function Trueques() {
  const [trueques, setTrueques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [categorias, setCategorias] = useState([]);
  const [catForm, setCatForm] = useState({ nombre: '' });
  const [editCatId, setEditCatId] = useState(null);

  useEffect(() => {
    cargarTrueques();
    cargarCategorias();
  }, [])

  const cargarCategorias = () => {
    CallsCategorias.GetCategorias().then(setCategorias).catch(() => setCategorias([]));
  };
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
    cargarCategorias();
  };
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
        cargarCategorias();
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
      cargarCategorias();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
    }
  };

  const cargarTrueques = () => {
    CallsTrueques.GetTrueques()
      .then(data => {
        setTrueques(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error cargando trueques')
        setLoading(false)
      })
  }

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (confirm.isConfirmed) {
      try {
        await CallsTrueques.DeleteTrueque(id)
        Swal.fire('Eliminado', 'El trueque ha sido eliminado.', 'success')
        cargarTrueques()
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el trueque.', 'error')
      }
    }
  }

  const handleEditar = async (trueque) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Trueque',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Título" value="${trueque.titulo}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción">${trueque.trueque}</textarea>` +
        `<input id="swal-input3" class="swal2-input" placeholder="Ubicación" value="${trueque.ubicacion}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="URL de imagen" value="${trueque.imagen_url || ''}">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Categoría ID" value="${typeof trueque.categoria === 'object' ? trueque.categoria.id : trueque.categoria}">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value,
        ]
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar'
    })

    if (formValues) {
      const [titulo, truequeDesc, ubicacion, imagen_url, categoria] = formValues
      if (!titulo.trim() || !truequeDesc.trim() || !ubicacion.trim() || !categoria) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error')
        return
      }
      try {
        const truequeAEnviar = {
          titulo,
          trueque: truequeDesc,
          ubicacion,
          imagen_url,
          categoria: Number(categoria),
          usuario: trueque.usuario  
        }
        await CallsTrueques.UpdateTrueques(trueque.id, truequeAEnviar)
        Swal.fire('Éxito', 'Trueque actualizado.', 'success')
        cargarTrueques()
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el trueque.', 'error')
      }
    }
  }

  const activos = trueques.filter(t => t.estado === 'pendiente' || t.estado === 'aceptado').length
  const registrados = trueques.length

  return (
    <div className="trueques-container">
      <ul className="trueques-list">
        <h3>Lista de trueques</h3>
        {loading && <li>Cargando...</li>}
        {error && <li>{error}</li>}
        {!loading && !error && trueques.length === 0 && <li>No hay trueques</li>}
        {!loading && !error && trueques.map(t => (
          <li key={t.id}>
            <strong>{t.titulo}</strong> - {t.estado}
            <br />
            <button onClick={() => Swal.fire({
              title: t.titulo,
              html: `
                <p><strong>Descripción:</strong> ${t.trueque}</p>
                <p><strong>Ubicación:</strong> ${t.ubicacion}</p>
                <p><strong>Estado:</strong> ${t.estado}</p>
                ${t.imagen_url ? `<img src="${t.imagen_url}" style="max-width:100%;margin-top:10px;" />` : ''}
              `,
              confirmButtonText: 'Cerrar'
            })}>Ver más</button>
            <button onClick={() => handleEditar(t)} style={{ marginLeft: '8px' }}>Editar</button>
            <button onClick={() => handleEliminar(t.id)} style={{ marginLeft: '8px' }}>Eliminar</button>
          </li>
        ))}
      </ul>

     
      <div style={{marginTop: 32}}>
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

      <div className="trueques-info">
        <h2>N° de trueques activos</h2>
        <p className="trueques-num">{activos}</p>
        <h2>N° de trueques registrados</h2>
        <p className="trueques-num">{registrados}</p>
      </div>
    </div>
  )
}
