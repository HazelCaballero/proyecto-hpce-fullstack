// aun no termino
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
  
  }



  return (
    <div className="mercado-container">
      <h1 className="mercado-title">Trueques</h1>
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
      </div>
      <div>
        <h2>Buscar trueques</h2>
        <input
          type="text"
          placeholder="Buscar por título o descripción"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="mercado-buscador"
        />
      </div>
      <div>
        <h2>Lista de trueques</h2>
        {truequesFiltrados.length === 0 ? (
          <div>No hay trueques publicados.</div>
        ) : (
          truequesFiltrados.map(t => (
            <div key={t.id} className="mercado-item">
              <h3>{t.titulo}</h3>
              <p>{t.trueque}</p>
              <p><b>Categoría:</b> {typeof t.categoria === 'object' ? t.categoria.nombre : t.categoria}</p>
              <p><b>Ubicación:</b> {t.ubicacion}</p>
              {t.imagen_url && <img src={t.imagen_url} alt="trueque" style={{maxWidth: '200px'}} />}
              <p><b>Estado:</b> {t.estado}</p>
              {Number(t.usuario) === usuario_id && (
                <div className="mercado-actions">
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
