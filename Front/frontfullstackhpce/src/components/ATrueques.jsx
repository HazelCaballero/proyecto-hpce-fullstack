import React, { useEffect, useState, memo } from 'react'
import CallsTrueques from '../services/CallsTrueques'
import CallsCategorias from '../services/CallsCategorias'
import Swal from 'sweetalert2'
import '../styles/Scomponents/ATrueques.css'
import Spinner from './Spinner'

const PAGE_SIZE = 10

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
  const [page, setPage] = useState(1);

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
      text: 'Esta acción eliminará la categoría permanentemente y, si tiene trueques asociados, también se eliminarán. ¿Deseas continuar?',
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
      if (error.type === 'confirm') {
        const confirm = await Swal.fire({
          title: '¡Atención!',
          text: error.detail,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar todo',
          cancelButtonText: 'Cancelar'
        });
        if (confirm.isConfirmed) {
          try {
            await CallsCategorias.DeleteCategorias(id, true);
            Swal.fire('Eliminado', 'La categoría y sus trueques asociados han sido eliminados.', 'success');
            cargarCategorias();
          } catch (e) {
            Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
          }
        }
      } else {
        Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
      }
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


  const removeTruequeLocal = (id) => {
    setTrueques(prev => prev.filter(t => t.id !== id));
  };

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
        removeTruequeLocal(id);
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el trueque.', 'error')
      }
    }
  }


  const updateTruequeLocal = (id, cambios) => {
    setTrueques(prev => prev.map(t => t.id === id ? { ...t, ...cambios } : t));
  };

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
          categoria_id: Number(categoria)
        }
        const actualizado = await CallsTrueques.UpdateTrueques(trueque.id, truequeAEnviar);
        Swal.fire('Éxito', 'Trueque actualizado.', 'success')
        updateTruequeLocal(trueque.id, actualizado || truequeAEnviar);
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el trueque.', 'error')
      }
    }
  }

  const paginatedTrueques = trueques.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activos = trueques.filter(t => t.estado === 'pendiente' || t.estado === 'aceptado').length
  const registrados = trueques.length


  const TruequeItem = memo(function TruequeItem({ t, onVer, onEditar, onEliminar }) {
    return (
      <li className='li-trueque'>
        <span className='descrip-trueque'>
          <b>Usuaria:</b> {t.usuario_nombre || t.usuario || 'Desconocida'}<br />
          Trueque:<strong>{t.titulo}</strong> <br /> Estado: {t.estado}
        </span>
        <br />
        <span className='btn-trueque'>
          <button onClick={() => onVer(t)} className="trueques-ver"> <img className='user-list-icon' src="../public/see-removebg-preview.png" alt="see-icon" /> </button>
          <button onClick={() => onEditar(t)} className="trueques-editar"> <img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /></button>
          <button onClick={() => onEliminar(t.id)} className="trueques-eliminar"><img className='user-list-icon' src="../public/trash-removebg-preview.png" alt="trash-icon" /></button>
        </span>
      </li>
    );
  });

  
  return (
    <div className="trueques-container">
      
      <div className="trueques-info">
        <h2 className='info-h2'>N° de trueques activos</h2>
        <p className="trueques-num">{activos}</p>
        <h2 className='info-h2'>N° de trueques registrados</h2>
        <p className="trueques-num">{registrados}</p>
      </div>
     
      <div className='trueques-list-container'>
     <h3 className='title-h3-2'>Lista de trueques</h3>
        <ul className="trueques-list"> 
          
          {loading && <Spinner />}
          {error && <li>{error}</li>}
          {!loading && !error && trueques.length === 0 && <li>No hay trueques</li>}
          {!loading && !error && paginatedTrueques.map(t => (
            <TruequeItem key={t.id} t={t} onVer={(t) => Swal.fire({
             title: t.titulo,
              html: `
                <p><strong>Ubicación:</strong> ${t.ubicacion}</p>
                <p><strong>Estado:</strong> ${t.estado}</p>
                ${t.imagen_url ? `<img src="${t.imagen_url}" style="max-width:100%;margin-top:10px;" />` : ''}
              `,
              confirmButtonText: 'Cerrar'
            })} onEditar={handleEditar} onEliminar={handleEliminar} />
          ))}
        </ul>
      </div>

     
      <div className='categorias-container'>
        
        <h3 className='title-h3'>Categorías</h3>
        <ul className='list-cate'>
          {categorias.map(c => (
            <li className='li-categories' key={c.id}>
              {c.nombre}
              <button onClick={()=>handleCatEdit(c)} className="categorias-editar"> <img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /></button>
              <button onClick={()=>handleCatDelete(c.id)} className="categorias-eliminar"><img className='user-list-icon' src="../public/trash-removebg-preview.png" alt="trash-icon" /></button>
            </li>
          ))}
        </ul><form onSubmit={handleCatSubmit} className="trueques-categorias-form">
          <label className='new-c' htmlFor="categoria">Nueva Categoría</label> <br />
          <input name="nombre" value={catForm.nombre} onChange={handleCatChange} placeholder="Categoría" required /> <br />
          <button className='btn-createc' type="submit">{editCatId ? 'Actualizar' : 'Crear'} Categoría</button>
          {editCatId && <button type="button" onClick={()=>{setEditCatId(null);setCatForm({nombre:''})}}>Cancelar</button>}
        </form>
      </div>
      
    </div>
  )
}

/*  <div className="trueques-paginacion">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
        <span className="trueques-pagina">Página {page} de {Math.ceil(trueques.length / PAGE_SIZE)}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= trueques.length}>Siguiente</button>
      </div>   */
