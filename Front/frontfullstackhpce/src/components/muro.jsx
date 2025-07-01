import React, { useEffect, useState } from 'react'
import CallsPublicidades from '../services/CallsPublicidades'
import CallsServicios from '../services/CallsServicios'
import CallsUsuarias from '../services/CallsUsuarias'
import CallsInterPublicacion from '../services/CallsInterPublicacion'
import Swal from 'sweetalert2'
import '../styles/Scomponents/Muro.css'

/**
 * Componente de muro de publicaciones y anuncios.
 * Permite ver, crear, comentar y gestionar publicaciones, anuncios y servicios.
 */
export default function Muro() {
  const [anuncios, setAnuncios] = useState([])
  const [servicios, setServicios] = useState([])
  const [publicaciones, setPublicaciones] = useState([])
  const [formPub, setFormPub] = useState({ titulo: '', publicacion: '', imagen_url: '' })
  const [usuarios, setUsuarios] = useState({})
  const [interaccionesPub, setInteraccionesPub] = useState({});
  const [nuevoComentarioPub, setNuevoComentarioPub] = useState({});
  const usuario_id = Number(localStorage.getItem('usuario_id'));

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
         
          let ids = Array.from(new Set((data || []).map(p => p.usuario)))
          try {
            const interData = await CallsInterPublicacion.GetInterPublicacion();
            const interUserIds = Array.from(new Set((interData || []).map(i => i.usuario)))
            ids = Array.from(new Set([...ids, ...interUserIds]))
          } catch {}
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
    precargarInteraccionesPublicacion();
  }, [])

 
  const precargarInteraccionesPublicacion = async () => {
    try {
      const data = await CallsInterPublicacion.GetInterPublicacion();
      const agrupadas = {};
      data.forEach(inter => {
        if (!agrupadas[inter.publicacion]) agrupadas[inter.publicacion] = [];
        agrupadas[inter.publicacion].push(inter);
      });
      setInteraccionesPub(agrupadas);
    } catch (error) {
      // Manejo de error opcional
    }
  };

 
  const handleEnviarInteraccionPub = async (pubId) => {
    try {
      const comentario = (nuevoComentarioPub[pubId] || '').trim();
      if (!comentario) {
        Swal.fire('Error', 'Debes escribir un comentario.', 'error');
        return;
      }
      await CallsInterPublicacion.PostInterPublicacion({
        publicacion: pubId,
        usuario: usuario_id,
        comentario
      });
      setNuevoComentarioPub(prev => ({ ...prev, [pubId]: '' }));
      precargarInteraccionesPublicacion();
      Swal.fire('¡Listo!', 'Tu comentario fue publicado.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el comentario.', 'error');
    }
  };

  
  const handleEliminarInteraccionPub = async (pubId, interId) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await CallsInterPublicacion.DeleteInterPublicacion(interId);
        precargarInteraccionesPublicacion();
        Swal.fire('Eliminado', 'El comentario ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el comentario.', 'error');
      }
    }
  };


  const handleComentarioChangePub = (pubId, value) => {
    setNuevoComentarioPub(prev => ({ ...prev, [pubId]: value }));
  };

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
      Swal.fire('Publicado', '¡Tu publicación se ha publicado con éxito!', 'success');

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
            className="muro-input-full"
          />
          <textarea
            name="publicacion"
            placeholder="¿Qué quieres compartir?"
            value={formPub.publicacion}
            onChange={handleChangePub}
            className="muro-input-full"
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL de imagen (opcional)"
            value={formPub.imagen_url}
            onChange={handleChangePub}
            className="muro-input-full"
          />
          <button onClick={handleCrearPublicacion}>Publicar</button>
        </div>
        <div className="muro-lista">
          {publicaciones.length === 0 ? (
            <div>No hay publicaciones</div>
          ) : (
            publicaciones.map(pub => {
              const usuarioActual = Number(localStorage.getItem('usuario_id'));
              const esPropia = Number(pub.usuario) === usuarioActual;
              const usuarioNombre = usuarios[pub.usuario]?.username || usuarios[pub.usuario]?.email || pub.usuario;
              return (
                <div key={pub.id} className="muro-publicacion-item">
                  <div className="muro-publicacion-autor">
                  <span className='publi-por'> Usuaria: <b>{usuarioNombre}</b></span> 
                  </div>

                  <b>Titulo: {pub.titulo}</b>
                  <div>Publicacion: {pub.publicacion}</div>
                  {pub.imagen_url && <img src={pub.imagen_url} alt="imagen" className="muro-publicacion-img" />}
                  {esPropia && (
                    <div className="muro-publicacion-propia-btns">
                      <button onClick={() => handleEditarPublicacion(pub)} className="muro-btn-editar">Editar</button>
                      <button onClick={() => handleEliminarPublicacion(pub)} className="muro-btn-eliminar">Eliminar</button>
                    </div>
                  )}
                  <div className="muro-publicacion-comentarios">
                    <p><b>Comentarios:</b></p>
                    {(interaccionesPub[pub.id] || []).length === 0
                      ? <div>No hay comentarios.</div>
                      : interaccionesPub[pub.id].map(inter => (
                          <div key={inter.id} className="muro-comentario-item">
                            <b>{usuarios[inter.usuario]?.nombre || usuarios[inter.usuario]?.username || usuarios[inter.usuario]?.email || inter.usuario_nombre || inter.usuario}</b>: {inter.comentario}
                            {Number(inter.usuario) === usuario_id && (
                              <button
                                onClick={() => handleEliminarInteraccionPub(pub.id, inter.id)}
                                className="muro-btn-eliminar-comentario"
                                title="Eliminar comentario"
                                aria-label="Eliminar comentario"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        ))
                    }
                    <div className="muro-comentario-nuevo">
                      {usuario_id && Number(pub.usuario) !== usuario_id && (
                        <div className="muro-megusta-block">
                          <label>
                            <input
                              type="checkbox"
                              checked={!!(interaccionesPub[pub.id] || []).find(
                                inter =>
                                  Number(inter.usuario) === usuario_id &&
                                  inter.comentario === "Me gusta esta publicación"
                              )}
                              onChange={async e => {
                                const yaExiste = (interaccionesPub[pub.id] || []).find(
                                  inter =>
                                    Number(inter.usuario) === usuario_id &&
                                    inter.comentario === "Me gusta esta publicación"
                                );
                                if (e.target.checked && !yaExiste) {
                                  await CallsInterPublicacion.PostInterPublicacion({
                                    publicacion: pub.id,
                                    usuario: usuario_id,
                                    comentario: "Me gusta esta publicación"
                                  });
                                  precargarInteraccionesPublicacion();
                                } else if (!e.target.checked && yaExiste) {
                                  await CallsInterPublicacion.DeleteInterPublicacion(yaExiste.id);
                                  precargarInteraccionesPublicacion();
                                }
                              }}
                              className="muro-checkbox-megusta"
                              aria-label="Marcar como me gusta"
                            />
                            Me gusta esta publicación
                          </label>
                          <span className="muro-megusta-count">
                            {(interaccionesPub[pub.id] || []).filter(
                              inter => inter.comentario === "Me gusta esta publicación"
                            ).length || 0} me gusta
                          </span>
                        </div>
                      )}
                      <textarea
                        placeholder="Escribe un comentario..."
                        value={nuevoComentarioPub[pub.id] || ''}
                        onChange={e => handleComentarioChangePub(pub.id, e.target.value)}
                        className="muro-comentario-textarea"
                        aria-label="Escribe un comentario"
                      />
                      <button
                        onClick={() => handleEnviarInteraccionPub(pub.id)}
                        disabled={!(nuevoComentarioPub[pub.id] && nuevoComentarioPub[pub.id].trim())}
                      >
                        Enviar comentario
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>


      <div className="muro-publicidad">
       <h2 className='publi-title-sti'>Publicidad</h2> 
       <div className='over-anun'>
        

        {anuncios.length === 0 ? (
          <div className="muro-anuncio">No hay anuncios activos</div>
        ) : (
          anuncios.map(anuncio => {
            const servicio = servicios.find(s => s.id === anuncio.servicio)
            return (
              <div className="muro-anuncio" key={anuncio.id}>
                <b>{servicio ? servicio.producto : 'Producto'}</b>
                <div>{servicio ? servicio.contenido : 'Sin contenido'}</div>
                <div><b>Precio:</b> {servicio ? servicio.precio_producto : '-'}</div>
              </div>
            )
          })
        )}
</div>
      </div>
      
    </div>
  )
}
