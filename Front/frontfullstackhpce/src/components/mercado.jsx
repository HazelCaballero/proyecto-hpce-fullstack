import React, { useEffect, useState } from 'react'
import CallsTrueques from '../services/CallsTrueques'
import CallsCategorias from '../services/CallsCategorias'
import Swal from 'sweetalert2'
import '../styles/Scomponents/Mercado.css'

export default function Mercado() {
  const [trueques, setTrueques] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [nuevoTrueque, setNuevoTrueque] = useState({
    titulo: '',
    trueque: '',
    categoria: '',
    ubicacion: '',
    imagen_url: ''
  })
  const [editandoId, setEditandoId] = useState(null)
  const usuario_id = Number(localStorage.getItem('usuario_id'))

  useEffect(() => {
    cargarTrueques()
    cargarCategorias()
  }, [])

  const cargarTrueques = async () => {
    try {
      const data = await CallsTrueques.GetTrueques()
      setTrueques(data)
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los trueques.', 'error')
    }
  }

  const cargarCategorias = async () => {
    try {
      const data = await CallsCategorias.GetCategorias()
      setCategorias(data)
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error')
    }
  }

  const handleChange = e => {
    setNuevoTrueque({ ...nuevoTrueque, [e.target.name]: e.target.value })
  }

  const handleCategoriaChange = e => {
    setNuevoTrueque({ ...nuevoTrueque, categoria: e.target.value })
  }

  const handleGuardar = async () => {
    try {
      if (
        !nuevoTrueque.titulo.trim() ||
        !nuevoTrueque.trueque.trim() ||
        !nuevoTrueque.categoria ||
        !nuevoTrueque.ubicacion.trim()
      ) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error')
        return
      }
      const usuario_id = localStorage.getItem('usuario_id')
      const truequeAEnviar = {
        ...nuevoTrueque,
        categoria: Number(nuevoTrueque.categoria),
        usuario: Number(usuario_id),
        estado: 'pendiente' 
      }
      if (editandoId) {
        await CallsTrueques.UpdateTrueques(editandoId, truequeAEnviar)
        Swal.fire('Éxito', 'Trueque actualizado.', 'success')
        setEditandoId(null)
      } else {
        await CallsTrueques.PostTrueques(truequeAEnviar)
        Swal.fire('Éxito', 'Trueque publicado.', 'success')
      }
      setNuevoTrueque({ titulo: '', trueque: '', categoria: '', ubicacion: '', imagen_url: '' })
      cargarTrueques()
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el trueque.', 'error')
    }
  }

  const handleCancelar = () => {
    setNuevoTrueque({ titulo: '', trueque: '', categoria: '', ubicacion: '', imagen_url: '' })
    setEditandoId(null)
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
        `<select id="swal-input5" class="swal2-select">
          <option value="">Selecciona una categoría</option>
          ${categorias.map(cat =>
            `<option value="${cat.id}" ${typeof trueque.categoria === 'object' ? (cat.id === trueque.categoria.id ? 'selected' : '') : (cat.id === trueque.categoria ? 'selected' : '')}>${cat.nombre}</option>`
          ).join('')}
        </select>`,
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
        const usuario_id = localStorage.getItem('usuario_id')
        const truequeAEnviar = {
          titulo,
          trueque: truequeDesc,
          ubicacion,
          imagen_url,
          categoria: Number(categoria),
          usuario: Number(usuario_id),
          estado: trueque.estado || 'pendiente'
        }
        await CallsTrueques.UpdateTrueques(trueque.id, truequeAEnviar)
        Swal.fire('Éxito', 'Trueque actualizado.', 'success')
        cargarTrueques()
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el trueque.', 'error')
      }
    }
  }

  const truequesFiltrados = trueques.filter(t =>
    t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.trueque.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEstadoChange = async (id, nuevoEstado, trueque) => {
    try {
  
      const actualizado = {
        ...trueque,
        categoria: typeof trueque.categoria === 'object' ? trueque.categoria.id : trueque.categoria,
        usuario: usuario_id,
        estado: nuevoEstado
      }
      await CallsTrueques.UpdateTrueques(id, actualizado)
      Swal.fire('Actualizado', `Estado cambiado a "${nuevoEstado}".`, 'success')
      cargarTrueques()
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error')
    }
  }

  return (
    <div className="mercado-container">
      <div>
        <h2>{editandoId ? 'Editar trueque' : 'Publicar nuevo trueque'}</h2>
        <div className="mercado-form">
          <div>
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={nuevoTrueque.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <textarea
              name="trueque"
              placeholder="Descripción del trueque"
              value={nuevoTrueque.trueque}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <select
              name="categoria"
              value={nuevoTrueque.categoria}
              onChange={handleCategoriaChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={nuevoTrueque.ubicacion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="imagen_url"
              placeholder="URL de imagen (opcional)"
              value={nuevoTrueque.imagen_url}
              onChange={handleChange}
            />
          </div>
          <div>
            <button onClick={handleGuardar}>
              {editandoId ? 'Guardar cambios' : 'Publicar Trueque'}
            </button>
            {editandoId && (
              <button onClick={handleCancelar} style={{ marginLeft: 8 }}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div> <br />
      <div>
        <h2>Buscar trueques</h2>
        <input
          type="text"
          placeholder="Buscar por título o descripción"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="mercado-buscador"
        />
      </div> <br />
      <div>
        <h2>Trueques</h2>
        {truequesFiltrados.length === 0 ? (
          <div>No hay trueques publicados.</div>
        ) : (
          truequesFiltrados.map(t => (
            <div key={t.id} className="mercado-item">
              <h3>{t.titulo}</h3>
              <p>{t.trueque}</p>
              <p><b>Categoría:</b> {typeof t.categoria === 'object' ? t.categoria.nombre : t.categoria}</p>
              <p><b>Ubicación:</b> {t.ubicacion}</p>
              {t.imagen_url && <img src={t.imagen_url} alt="trueque" style={{ maxWidth: '200px' }} />}
              <p><b>Estado:</b> {t.estado}</p>
              
              {Number(t.usuario) === usuario_id && (
                <div style={{ marginTop: 10 }}>
                  <label>
                    Cambiar estado:{' '}
                    <select
                      value={t.estado}
                      onChange={e => handleEstadoChange(t.id, e.target.value, t)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aceptado">Aceptado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </label>
                </div>
              )}

              {Number(t.usuario) === usuario_id && (
                <div className="mercado-actions" style={{ marginTop: 10 }}>
                  <button onClick={() => handleEditar(t)}>Editar</button>
                  <button onClick={() => handleEliminar(t.id)}>Eliminar</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
