import React, { useEffect, useState } from 'react'
import CallsTrueques from '../services/CallsTrueques'
import CallsCategorias from '../services/CallsCategorias'
import CallsInterTrueques from '../services/CallsInterTrueques'
import Swal from 'sweetalert2'
import '../styles/Scomponents/Mercado.css'

/**
 * Componente de mercado de trueques.
 * Permite ver, buscar, crear, editar y comentar trueques.
 */
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
  const [interacciones, setInteracciones] = useState({})
  const [nuevoComentario, setNuevoComentario] = useState({})    
  const usuario_id = Number(localStorage.getItem('usuario_id'))

  const [filtros, setFiltros] = useState({
    usuaria: true,
    titulo: true,
    contenido: true,
    ubicacion: true,
    comentarios: true,
    pendiente: true,
    aceptado: true,
    cancelado: true,
  });

  useEffect(() => {
    cargarTrueques();
    cargarCategorias();
    precargarInteracciones();
  }, []);

  // Precarga todas las interacciones y las agrupa por trueque
  const precargarInteracciones = async () => {
    try {
      const data = await CallsInterTrueques.GetInterTrueques();
      const agrupadas = {};
      data.forEach(inter => {
        if (!agrupadas[inter.trueque]) agrupadas[inter.trueque] = [];
        agrupadas[inter.trueque].push(inter);
      });
      setInteracciones(agrupadas);
    } catch (error) {
      // Manejo de error opcional
    }
  };

  const cargarTrueques = async () => {
    try {
      const data = await CallsTrueques.GetTrueques();
      // Enriquecer trueques con el nombre de la usuaria
      const truequesConNombre = await Promise.all(
        data.map(async t => {
          if (!t.usuario_nombre && t.usuario) {
            try {
              const usuaria = await import('../services/CallsUsuarias').then(m => m.default.GetUsuaria(t.usuario));
              return { ...t, usuario_nombre: usuaria.username || usuaria.nombre || usuaria.email || t.usuario };
            } catch {
              return { ...t };
            }
          }
          return t;
        })
      );
      setTrueques(truequesConNombre);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los trueques.', 'error');
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

  // Función para cargar interacciones de un trueque
  const cargarInteracciones = async (truequeId) => {
    try {
      const data = await CallsInterTrueques.GetInterTruequesPorTrueque(truequeId);
      setInteracciones(prev => ({ ...prev, [truequeId]: data }));
    } catch (error) {
      // Manejo de error opcional
    }
  };

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
      // Enviar usuario para asociar el trueque correctamente
      const usuario_id = Number(localStorage.getItem('usuario_id'));
      const truequeAEnviar = {
        titulo: nuevoTrueque.titulo,
        trueque: nuevoTrueque.trueque,
        ubicacion: nuevoTrueque.ubicacion,
        imagen_url: nuevoTrueque.imagen_url,
        categoria_id: Number(nuevoTrueque.categoria),
        estado: 'pendiente',
        usuario: usuario_id
      }
      console.log('Enviando trueque:', truequeAEnviar)
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
      Swal.fire('Error', error.message || 'No se pudo guardar el trueque.', 'error')
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
          categoria_id: Number(categoria), 
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

  // Filtro avanzado
  const truequesFiltrados = trueques.filter(t => {
    if (!filtros[t.estado]) return false;
    if (!busqueda.trim()) return true;
    const texto = busqueda.toLowerCase();

    let matchUsuaria = false;
    if (filtros.usuaria) {
      const nombre = (t.usuario_nombre || t.usuario || '').toString().toLowerCase();
      matchUsuaria = nombre.includes(texto);
    }
    let matchTitulo = false;
    if (filtros.titulo) {
      matchTitulo = (t.titulo || '').toLowerCase().includes(texto);
    }
    let matchContenido = false;
    if (filtros.contenido) {
      matchContenido = (t.trueque || '').toLowerCase().includes(texto);
    }
    let matchUbicacion = false;
    if (filtros.ubicacion) {
      matchUbicacion = (t.ubicacion || '').toLowerCase().includes(texto);
    }
    let matchComentarios = false;
    if (filtros.comentarios && interacciones[t.id]) {
      matchComentarios = interacciones[t.id].some(inter =>
        (inter.comentario || '').toLowerCase().includes(texto)
      );
    }
    return matchUsuaria || matchTitulo || matchContenido || matchUbicacion || matchComentarios;
  });

  const handleEstadoChange = async (id, nuevoEstado, trueque) => {
    try {
      const actualizado = {
        ...trueque,
        categoria_id: typeof trueque.categoria === 'object' ? trueque.categoria.id : trueque.categoria, 
        usuario: usuario_id,
        estado: nuevoEstado
      }
      delete actualizado.categoria 
      await CallsTrueques.UpdateTrueques(id, actualizado)
      Swal.fire('Actualizado', `Estado cambiado a "${nuevoEstado}".`, 'success')
      cargarTrueques()
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error')
    }
  }

  // Manejar cambio en comentario
  const handleComentarioChange = (truequeId, value) => {
    setNuevoComentario(prev => ({ ...prev, [truequeId]: value }));
  };

  const handleEnviarInteraccion = async (truequeId) => {
    try {
      const comentario = (nuevoComentario[truequeId] || '').trim();
      if (!comentario) {
        Swal.fire('Error', 'Debes escribir un comentario.', 'error');
        return;
      }
      await CallsInterTrueques.PostInterTrueques({
        trueque: truequeId,
        usuario: usuario_id,
        comentario
      });
      setNuevoComentario(prev => ({ ...prev, [truequeId]: '' }));
      cargarInteracciones(truequeId);
      Swal.fire('¡Listo!', 'Tu comentario fue publicado.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el comentario.', 'error');
    }
  };

  // Crear comentario automático de "Me interesa"
  const handleEnviarInteraccionMeInteresa = async (truequeId) => {
    try {
      await CallsInterTrueques.PostInterTrueques({
        trueque: truequeId,
        usuario: usuario_id,
        comentario: "Me interesa este trueque"
      });
      cargarInteracciones(truequeId);
    } catch (error) {
      Swal.fire('Error', 'No se pudo marcar como interesado.', 'error');
    }
  };

  // Eliminar una interacción
  const handleEliminarInteraccion = async (truequeId, interaccionId) => {
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
        await CallsInterTrueques.DeleteInterTrueques(interaccionId);
        cargarInteracciones(truequeId);
        Swal.fire('Eliminado', 'Tu comentario ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el comentario.', 'error');
      }
    }
  };

  // Helper para saber si el usuario ya marcó "me interesa"
  const usuarioYaInteresado = (interacciones, truequeId, usuario_id) => 
    !!(interacciones[truequeId] || []).find(
      inter =>
        Number(inter.usuario) === usuario_id &&
        inter.comentario === "Me interesa este trueque"
    );





  return (
    <div className="mercado-container">






      <div className='publi-true'>
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
              aria-label="Título del trueque"
              className="mercado-input"
            />
          </div>
          <div>
            <textarea
              name="trueque"
              placeholder="Descripción del trueque"
              value={nuevoTrueque.trueque}
              onChange={handleChange}
              required
              aria-label="Descripción del trueque"
              className="mercado-textarea"
            />
          </div>
          <div>
            <select
              name="categoria"
              value={nuevoTrueque.categoria}
              onChange={handleCategoriaChange}
              required
              aria-label="Categoría"
              className="mercado-select"
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
              aria-label="Ubicación"
              className="mercado-input"
            />
          </div>
          <div>
            <input
              type="url"
              name="imagen_url"
              placeholder="URL de imagen (opcional)"
              value={nuevoTrueque.imagen_url}
              onChange={handleChange}
              aria-label="URL de imagen"
              className="mercado-input"
            />
          </div>
          <div>
            <button onClick={handleGuardar}>
              {editandoId ? 'Guardar cambios' : 'Publicar Trueque'}
            </button>
            {editandoId && (
              <button onClick={handleCancelar} className="mercado-btn-cancel">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div> <br />







      <div className='busc-true'>
        <div className='bus-true'>
        <h2>Buscar trueques</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="mercado-mb8"
          aria-label="Buscar trueques"
        /></div>
        <div className="mercado-flex">
          <label><input type="checkbox" checked={filtros.usuaria} onChange={e => setFiltros(f => ({ ...f, usuaria: e.target.checked }))} /> Usuaria</label>
          <label><input type="checkbox" checked={filtros.titulo} onChange={e => setFiltros(f => ({ ...f, titulo: e.target.checked }))} /> Título</label>
          <label><input type="checkbox" checked={filtros.contenido} onChange={e => setFiltros(f => ({ ...f, contenido: e.target.checked }))} /> Contenido</label>
          <label><input type="checkbox" checked={filtros.ubicacion} onChange={e => setFiltros(f => ({ ...f, ubicacion: e.target.checked }))} /> Ubicación</label>
          <label><input type="checkbox" checked={filtros.comentarios} onChange={e => setFiltros(f => ({ ...f, comentarios: e.target.checked }))} /> Comentarios</label>
          <label><input type="checkbox" checked={filtros.pendiente} onChange={e => setFiltros(f => ({ ...f, pendiente: e.target.checked }))} /> Pendiente</label>
          <label><input type="checkbox" checked={filtros.aceptado} onChange={e => setFiltros(f => ({ ...f, aceptado: e.target.checked }))} /> Aceptado</label>
          <label><input type="checkbox" checked={filtros.cancelado} onChange={e => setFiltros(f => ({ ...f, cancelado: e.target.checked }))} /> Cancelado</label>
        </div>
      </div> <br />








      <div className='true-ques'>
        <h2>Trueques</h2>


        {truequesFiltrados.length === 0 ? (
          <div>No hay trueques publicados.</div>
        ) : (
          truequesFiltrados.map(t => (
            <div key={t.id} className="mercado-item">
              <p> <strong>Usuaria:</strong>
                <b>
                  {t.usuario_nombre ||
                    (interacciones[t.id] && interacciones[t.id].find(inter => inter.usuario_nombre)?.usuario_nombre) ||
                    t.usuario}
                </b>
              </p>
              <h3>Trueque: {t.titulo}</h3>
              <p>{t.trueque}</p>
              <p><b>Categoría:</b> {typeof t.categoria === 'object' ? t.categoria.nombre : t.categoria}</p>
              <p><b>Ubicación:</b> {t.ubicacion}</p>
              {t.imagen_url && <img src={t.imagen_url} alt="trueque" className="mercado-img-200" />}
              <p><b>Estado:</b> {t.estado}</p>
              
              {Number(t.usuario) === usuario_id && (
                <div className="mercado-mt10">
                  <label>
                    Cambiar estado:{' '}
                    <select
                      value={t.estado}
                      onChange={e => handleEstadoChange(t.id, e.target.value, t)}
                      aria-label="Cambiar estado"
                      className="mercado-select"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aceptado">Aceptado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </label>
                  <div className="mercado-actions">
                    <button onClick={() => handleEditar(t)} aria-label="Editar trueque">Editar</button>
                    <button onClick={() => handleEliminar(t.id)} aria-label="Eliminar trueque">Eliminar</button>
                  </div>
                </div>
              )}
              <br />







              <div className="mercado-mt10">

               {usuario_id && Number((t.usuario && t.usuario.id) || t.usuario) !== usuario_id && (
                  <div style={{ margin: '10px 0' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={usuarioYaInteresado(interacciones, t.id, usuario_id)}
                        onChange={async e => {
                          const yaExiste = (interacciones[t.id] || []).find(
                            inter =>
                              Number(inter.usuario) === usuario_id &&
                              inter.comentario === "Me interesa este trueque"
                          );
                          if (e.target.checked && !yaExiste) {
                            await handleEnviarInteraccionMeInteresa(t.id);
                          } else if (!e.target.checked && yaExiste) {
                            await handleEliminarInteraccion(t.id, yaExiste.id);
                          }
                        }}
                        style={{ marginRight: 4 }}
                        aria-label="Marcar como interesado"
                      />
                      Me interesa este trueque
                    </label>
                    <span style={{ marginLeft: 12, color: 'green' }}>
                      {(interacciones[t.id] || []).filter(
                        inter => inter.comentario === "Me interesa este trueque"
                      ).length || 0} personas interesadas
                    </span>
                  </div>
                )}

                <div>
                  <input
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario[t.id] || ''}
                    onChange={e => handleComentarioChange(t.id, e.target.value)}
                    
                    aria-label="Escribe un comentario"
                    className="mercado-textarea-co"
                  />
                  <button
                    onClick={() => handleEnviarInteraccion(t.id)}
                    disabled={!(nuevoComentario[t.id] && nuevoComentario[t.id].trim())}
                    className="mercado-boton-enviar"
                  >
                    Enviar comentario
                  </button >
                <div><p><b>Comentarios:</b></p>
                  {(interacciones[t.id] || []).length === 0
                    ? <div>No hay comentarios.</div>
                    : interacciones[t.id].map(inter => (
                        <div key={inter.id} style={{ marginBottom: 4 }}>
                          <b>{inter.usuario_nombre || inter.usuario}</b>: {inter.comentario}
                          {Number(inter.usuario) === usuario_id && (
                            <button
                              onClick={() => handleEliminarInteraccion(t.id, inter.id)}
                              style={{ marginLeft: 8, color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                              title="Eliminar comentario"
                              aria-label="Eliminar comentario"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))
                  }
                </div>




                </div>
              </div>
            </div>
          ))
        )}
      </div>




    </div>
  )
}
