import React, { useEffect, useState } from 'react'
import CallsPublicidades from '../services/CallsPublicidades'
import CallsServicios from '../services/CallsServicios'
import CallsUsuarias from '../services/CallsUsuarias'
import Swal from 'sweetalert2'
import '../styles/Scomponents/Muro.css'

export default function Muro() {
  const [anuncios, setAnuncios] = useState([])
  const [servicios, setServicios] = useState([])
  const [publicaciones, setPublicaciones] = useState([])
  const [formPub, setFormPub] = useState({ titulo: '', publicacion: '', imagen_url: '' })
  const [usuarios, setUsuarios] = useState({})

  useEffect(() => {
    CallsPublicidades.GetPublicidad()
      .then(data => {
        setAnuncios(Array.isArray(data) ? data.filter(a => a.estado === 'activada') : [])
      })
      .catch(() => setAnuncios([]))
    CallsServicios.GetServicios()
      .then(data => setServicios(Array.isArray(data) ? data : []))
      .catch(() => setServicios([]))

    import('../services/CallsPublicaciones').then(({ default: CallsPublicaciones }) => {
      CallsPublicaciones.GetPublicaciones()
        .then(async data => {
          setPublicaciones(Array.isArray(data) ? data : [])
          
          const ids = Array.from(new Set((data || []).map(p => p.usuario)))
          const usuariosObj = {}
          await Promise.all(ids.map(async id => {
            try {
              const u = await CallsUsuarias.GetUsuaria(id)
              usuariosObj[id] = u
            } catch {
              usuariosObj[id] = { username: id }
            }
          }))
          setUsuarios(usuariosObj)
        })
        .catch(() => setPublicaciones([]))
    })
  }, [])

  const handleChangePub = e => {
    setFormPub({ ...formPub, [e.target.name]: e.target.value })
  }

  const handleCrearPublicacion = async () => {
    if (!formPub.titulo.trim() || !formPub.publicacion.trim()) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'error');
      return;
    }
    try {
      const usuario = Number(localStorage.getItem('usuario_id'))
      const obj = { ...formPub, usuario }
      const CallsPublicaciones = (await import('../services/CallsPublicaciones')).default
      await CallsPublicaciones.PostPublicaciones(obj)
      setFormPub({ titulo: '', publicacion: '', imagen_url: '' })

      const data = await CallsPublicaciones.GetPublicaciones()
      setPublicaciones(Array.isArray(data) ? data : [])
      
      if (obj.usuario && !usuarios[obj.usuario]) {
        try {
          const u = await CallsUsuarias.GetUsuaria(obj.usuario)
          setUsuarios(prev => ({ ...prev, [obj.usuario]: u }))
        } catch {}
      }
    } catch (e) {
      Swal.fire('Error', 'Error al crear la publicación', 'error')
    }
  }

  const handleEditarPublicacion = async pub => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar publicación',
      html:
        `<input id="swal-titulo" class="swal2-input" placeholder="Título" value="${pub.titulo || ''}">` +
        `<textarea id="swal-publicacion" class="swal2-textarea" placeholder="Publicación">${pub.publicacion || ''}</textarea>` +
        `<input id="swal-imagen" class="swal2-input" placeholder="URL de imagen (opcional)" value="${pub.imagen_url || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          titulo: document.getElementById('swal-titulo').value,
          publicacion: document.getElementById('swal-publicacion').value,
          imagen_url: document.getElementById('swal-imagen').value
        }
      }
    });
    if (formValues) {
      try {
        const CallsPublicaciones = (await import('../services/CallsPublicaciones')).default
        await CallsPublicaciones.UpdatePublicaciones(pub.id, { ...pub, ...formValues })
        const data = await CallsPublicaciones.GetPublicaciones()
        setPublicaciones(Array.isArray(data) ? data : [])
        Swal.fire('Actualizado', 'La publicación ha sido actualizada.', 'success')
      } catch (e) {
        Swal.fire('Error', 'No se pudo actualizar la publicación.', 'error')
      }
    }
  }

  const handleEliminarPublicacion = async pub => {
    const confirm = await Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (confirm.isConfirmed) {
      try {
        const CallsPublicaciones = (await import('../services/CallsPublicaciones')).default
        await CallsPublicaciones.DeletePublicaciones(pub.id)
        setPublicaciones(publicaciones => publicaciones.filter(p => p.id !== pub.id))
        Swal.fire('Eliminada', 'La publicación ha sido eliminada.', 'success')
      } catch (e) {
        Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error')
      }
    }
  }

  return (
    <div className="muro-container">
      <div className="muro-publicaciones">
        <div className="muro-publicar">
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formPub.titulo}
            onChange={handleChangePub}
            style={{ marginBottom: 8, width: '100%' }}
          />
          <textarea
            name="publicacion"
            placeholder="¿Qué quieres compartir?"
            value={formPub.publicacion}
            onChange={handleChangePub}
            style={{ marginBottom: 8, width: '100%' }}
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL de imagen (opcional)"
            value={formPub.imagen_url}
            onChange={handleChangePub}
            style={{ marginBottom: 8, width: '100%' }}
          />
          <button onClick={handleCrearPublicacion}>Publicar</button>
        </div>
        <div className="muro-lista">
            <h2>Publicaciones</h2>
          {publicaciones.length === 0 ? (
            <div>No hay publicaciones</div>
          ) : (
            publicaciones.map(pub => {
              const usuarioActual = Number(localStorage.getItem('usuario_id'))
              const esPropia = Number(pub.usuario) === usuarioActual
              const usuarioNombre = usuarios[pub.usuario]?.username || usuarios[pub.usuario]?.email || pub.usuario
              return (
                <div key={pub.id} className="muro-publicacion-item" style={{border:'1px solid #eee',borderRadius:6,padding:10,marginBottom:8}}>
                  <div style={{fontSize:13, color:'#888', marginBottom:4}}>
                    Publicado por: <b>{usuarioNombre}</b>
                  </div>
                  <b>{pub.titulo}</b>
                  <div>{pub.publicacion}</div>
                  {pub.imagen_url && <img src={pub.imagen_url} alt="imagen" style={{maxWidth:'100%',maxHeight:200,marginTop:8}} />}
                  {esPropia && (
                    <div style={{marginTop:8}}>
                      <button onClick={() => handleEditarPublicacion(pub)} style={{marginRight:8}}>Editar</button>
                      <button onClick={() => handleEliminarPublicacion(pub)} style={{color:'red'}}>Eliminar</button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      <div className="muro-publicidad">
        <h2>Publicidad</h2>
        {anuncios.length === 0 ? (
          <div className="muro-anuncio">No hay anuncios activos</div>
        ) : (
          anuncios.map(anuncio => {
            const servicio = servicios.find(s => s.id === anuncio.servicio)
            return (
              <div className="muro-anuncio" key={anuncio.id}>
                <b>{servicio ? servicio.producto : 'Producto'}</b>
                <div>{servicio ? servicio.contenido : 'Sin contenido'}</div>
                <div><b>Precio:</b> {anuncio.precio_publicidad}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
