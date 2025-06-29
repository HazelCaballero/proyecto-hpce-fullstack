// al crear anuncios no se ven hasta que se refresca la página debo arreglarlo e igual al mostrar
// un anuncio activo o sesactivarlo no se actualiza hasta que se refresca la página
// el precio del anuncio debe poder ser un nuero mas grande
import React, { useState, useEffect } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import CallsPublicidades from '../services/CallsPublicidades';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';
import '../styles/Scomponents/Publicity.css';
import ServiciosAdmin from './ServiciosAdmin';
import ListaServicios from './ListaServicios';
import ServicioForm from './ServicioForm';

/**
 * Wrapper para conectar los handlers de editar/eliminar servicios con la lista
 */
function ServiciosAdminWrapper({ servicios, setServicios }) {
  const handleEdit = async (s) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar servicio',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Producto" value="${s.producto || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Contenido" value="${s.contenido || ''}">` +
        `<input id="swal-input3" class="swal2-input" type="number" placeholder="Precio del producto" value="${s.precio_producto || ''}">` +
        `<input id="swal-input4" class="swal2-input" type="number" placeholder="Monto pagado por publicidad" value="${s.monto_pagado || ''}">` +
        `<input id="swal-input5" class="swal2-input" type="number" placeholder="Días de anuncio" value="${s.dias_anuncio || ''}">` +
        `<input id="swal-input6" class="swal2-input" type="number" placeholder="Precio de la publicidad" value="${s.precio_publicidad || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value,
          document.getElementById('swal-input6').value
        ];
      }
    });
    if (formValues) {
      const [producto, contenido, precio_producto, monto_pagado, dias_anuncio, precio_publicidad] = formValues;
      if (!producto.trim() || !contenido.trim() || !precio_producto || !monto_pagado || !dias_anuncio || !precio_publicidad) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
        return;
      }
      try {
        const usuarioId = Number(localStorage.getItem('usuario_id'));
        const dataToSend = {
          producto,
          contenido,
          precio_producto: Number(precio_producto),
          monto_pagado: Number(monto_pagado),
          dias_anuncio: Number(dias_anuncio),
          precio_publicidad: Number(precio_publicidad),
          usuario: usuarioId
        };
        const actualizado = await CallsServicios.UpdateServicios(s.id, dataToSend);
        setServicios(prev => prev.map(serv => serv.id === s.id ? { ...serv, ...(actualizado || dataToSend) } : serv));
        Swal.fire('Actualizado', 'El servicio ha sido actualizado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el servicio de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await CallsServicios.DeleteServicios(id);
      setServicios(prev => prev.filter(s => s.id !== id));
      Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
    }
  };

  return (
    <ListaServicios servicios={servicios} onEdit={handleEdit} onDelete={handleDelete} />
  );
}

function UsuarioNombre({ usuarioId }) {
  const [nombre, setNombre] = useState('Cargando...');
  useEffect(() => {
    let activo = true;
    CallsUsuarias.GetUsuaria(usuarioId)
      .then(usuario => {
        if (activo) setNombre(usuario.nombre || usuario.username || usuario.email || usuarioId);
      })
      .catch(() => {
        if (activo) setNombre(usuarioId);
      });
    return () => { activo = false; };
  }, [usuarioId]);
  return <>{nombre}</>;
}

export default function Publicity({ onCreated }) {
  const [form, setForm] = useState({
    producto: '',
    contenido: '',
    fecha_inicio: '',
    precio: '',
    imagen: '',
    servicioId: ''
  });
  const [loading, setLoading] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [publicidades, setPublicidades] = useState([]);
  const [editPubId, setEditPubId] = useState(null);
  const [modalAnuncio, setModalAnuncio] = useState(null);
  const [servicioDetalle, setServicioDetalle] = useState(null);

  useEffect(() => {
    if (modalAnuncio && modalAnuncio.servicio) {
      setServicioDetalle(null);
      CallsServicios.GetServicio(modalAnuncio.servicio)
        .then(data => setServicioDetalle(data))
        .catch(() => setServicioDetalle(null));
    }
  }, [modalAnuncio]);

  useEffect(() => {
    async function fetchServicios() {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://127.0.0.1:8000/api/servicios/', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
          }
        });
        const data = await response.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (error) {
        setServicios([]);
      }
    }
    fetchServicios();
  }, []);

  useEffect(() => {
    async function fetchPublicidades() {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://127.0.0.1:8000/api/publicidades/', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
          }
        });
        const data = await response.json();
        setPublicidades(Array.isArray(data) ? data : []);
      } catch (error) {
        setPublicidades([]);
      }
    }
    fetchPublicidades();
  }, []);


  const addPublicidadLocal = (nuevaPublicidad) => {
    setPublicidades(prev => [nuevaPublicidad, ...prev]);
  };

  const updatePublicidadLocal = (id, cambios) => {
    setPublicidades(prev => prev.map(p => p.id === id ? { ...p, ...cambios } : p));
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrearAnuncio = async () => {
    if (!form.servicioId) {
      Swal.fire('Error', 'Selecciona un servicio para publicar el anuncio', 'error');
      return;
    }
    setLoading(true);
    try {
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      const servicioSeleccionado = servicios.find(s => s.id === Number(form.servicioId));
      if (!servicioSeleccionado) {
        Swal.fire('Error', 'Servicio no encontrado', 'error');
        setLoading(false);
        return;
      }
      const dataToSend = {
        servicio: servicioSeleccionado.id,
        usuario: usuarioId,
        estado: 'activada'
      };
      let nuevaPublicidad;
      if (editPubId) {
        nuevaPublicidad = await CallsPublicidades.UpdatePublicidad(editPubId, dataToSend);
        updatePublicidadLocal(editPubId, nuevaPublicidad);
        setEditPubId(null);
      } else {
        nuevaPublicidad = await CallsPublicidades.PostPublicidad(dataToSend);
        if (nuevaPublicidad && nuevaPublicidad.id) {
          addPublicidadLocal(nuevaPublicidad);
        } else {
          // fallback: recargar todo si la API no devuelve el objeto
          const data = await CallsPublicidades.GetPublicidad();
          setPublicidades(Array.isArray(data) ? data : []);
        }
      }
      setForm({ producto: '', contenido: '', precio: '', imagen: '', servicioId: '' });
      if (onCreated) onCreated();
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire('Error', 'Error: ' + JSON.stringify(error.response.data), 'error');
      } else {
        Swal.fire('Error', 'Error al crear el anuncio', 'error');
      }
    }
    setLoading(false);
  };


  
  const handleEditPublicidad = async (anuncio) => {
    let selectedServicio = servicios.find(s => s.id === anuncio.servicio);
    const { value: formValues } = await Swal.fire({
      title: 'Editar anuncio',
      html:
        `<select id="swal-input-servicio" class="swal2-input">
          ${servicios.map(s => `<option value="${s.id}" ${anuncio.servicio === s.id ? 'selected' : ''}>${s.producto || `Servicio ${s.id}`}</option>`).join('')}
        </select>
        <input id="swal-input-precio" class="swal2-input" placeholder="Precio" type="number" value="${anuncio.precio_publicidad || ''}">
        <input id="swal-input-imagen" class="swal2-input" placeholder="Imagen (URL)" value="${anuncio.imagen || ''}">
        <div style="margin-top:8px;text-align:left;">
          <b>Producto:</b> <span id="swal-producto">${selectedServicio?.producto || '-'}</span><br/>
          <b>Contenido:</b> <span id="swal-contenido">${selectedServicio?.contenido || '-'}</span>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const servicioSelect = document.getElementById('swal-input-servicio');
        servicioSelect.addEventListener('change', function() {
          const servicio = servicios.find(s => s.id === Number(this.value));
          document.getElementById('swal-producto').textContent = servicio?.producto || '-';
          document.getElementById('swal-contenido').textContent = servicio?.contenido || '-';
        });
      },
      preConfirm: () => {
        return [
          document.getElementById('swal-input-servicio').value,
          document.getElementById('swal-input-precio').value,
          document.getElementById('swal-input-imagen').value
        ];
      }
    });
    if (formValues) {
      const [servicioId, precio, imagen] = formValues;
      if (!precio || !servicioId) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
        return;
      }
      try {
        const usuarioId = Number(localStorage.getItem('usuario_id'));
        const dataToSend = {
          precio_publicidad: Number(precio),
          imagen,
          servicio: Number(servicioId),
          usuario: usuarioId
        };
        await CallsPublicidades.UpdatePublicidad(anuncio.id, dataToSend);
        Swal.fire('Actualizado', 'El anuncio ha sido actualizado.', 'success');
        // Actualizar localmente el anuncio editado
        updatePublicidadLocal(anuncio.id, dataToSend);
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el anuncio.', 'error');
      }
    }
  };

  const handleDeletePublicidad = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el anuncio de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await CallsPublicidades.DeletePublicidad(id);
      Swal.fire('Eliminado', 'El anuncio ha sido eliminado.', 'success');
      setPublicidades(publicidades.filter(anuncio => anuncio.id !== id));
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el anuncio.', 'error');
    }
  };

  return (
    <>
      <div className="publicity-admin-container">
        <h2 className="publicity-titulo">Gestión de Publicidad</h2>

        <div className="publicity-bloques-grid">

          <div className="publicity-bloque publicity-bloque-formulario">

            <form onSubmit={e => { e.preventDefault(); handleCrearAnuncio(); }}>
              <div className="form-anuncio-group">
                <label htmlFor="servicioId"><span className='publi-style'>Anuncio</span></label>

                <select
                  id="servicioId"
                  name="servicioId"
                  value={form.servicioId}
                  onChange={e => {
                    const selectedServicio = servicios.find(s => s.id === Number(e.target.value));
                    // Fecha actual en formato yyyy-mm-dd
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    const fechaActual = `${yyyy}-${mm}-${dd}`;
                    setForm({
                      ...form,
                      servicioId: e.target.value,
                      producto: selectedServicio ? selectedServicio.producto : '',
                      contenido: selectedServicio ? selectedServicio.contenido : '',
                      fecha_inicio: fechaActual
                    });
                  }}
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.producto || `Servicio ${servicio.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-anuncio-group">
                <label><span className='publi-style'>Producto </span></label>
                <input type="text" value={form.producto || ''} readOnly />
              </div>

              <div className="form-anuncio-group">
                <label><span className='publi-style'> Contenido del anuncio </span></label>
                <input
                  type="text"
                  name="contenido"
                  value={form.contenido || ''}
                  readOnly
                />
              </div>

              <div className="form-anuncio-group">
                <label><span className='publi-style'>Fecha inicio </span></label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio || ''}
                  readOnly
                />
              </div>

              <button type="submit" className="form-anuncio-btn">
                Activar anuncio
              </button>
            </form>

          </div>
        </div>
      </div>
     
      {/* Listas de anuncios y servicios como contenedores individuales al mismo nivel */}
      <div className="listas-publicidad-servicios">
       
       
        <div className="bloque-lista">
          <h3 className='title-list'>Lista de Anuncios</h3>
          <ul className="publicity-list">
            {publicidades.length === 0 ? (
              <li>No hay anuncios</li>
            ) : (
              publicidades.map((ad, idx) => (
                <li key={ad.id || idx} className="publicity-list-item">
                  <div className='descri-item'>
                    <div><b>Producto:</b> {ad.producto || '-'}</div>
                    <div><b>Estado:</b> {ad.estado}</div>
                    <div><b>Precio:</b> {ad.precio_servicio || '-'}</div>
                    <div><b>Usuario:</b> <UsuarioNombre usuarioId={ad.usuario} /></div>
                    <div><b>Servicio ID:</b> {ad.servicio}</div>
                  </div>
                  <div className="publicity-actions">
                    <button onClick={() => setModalAnuncio(ad)} className="publicity-btn"><img className='user-list-icon' src="../public/see-removebg-preview.png" alt="see-icon" /></button>
                    <button onClick={() => handleEditPublicidad(ad)} className="publicity-btn"><img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /></button>
                    <button
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: '¿Estás seguro?',
                          text: 'Esta acción eliminará el anuncio de forma permanente.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar'
                        });
                        if (!result.isConfirmed) return;
                        try {
                          await CallsPublicidades.DeletePublicidad(ad.id);
                          Swal.fire('Eliminado', 'El anuncio ha sido eliminado.', 'success');
                          setPublicidades(prev => prev.filter(p => p.id !== ad.id));
                        } catch (err) {
                          Swal.fire('Error', 'Error al eliminar el anuncio', 'error');
                        }
                      }}
                      className="publicity-btn"
                    >
                      <img className='user-list-icon' src="../public/trash-removebg-preview.png" alt="trash-icon" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        
        
        
        <div className="servicios-bloque servicios-bloque-lista">
          <div className='servi-title'><h3 className='title-list'>Lista de Servicios</h3></div>
          <ServiciosAdminWrapper servicios={servicios} setServicios={setServicios} />
        </div>
        {modalAnuncio && (
          <div className="publicity-modal">
            <div className="publicity-modal-content">
              <h2>Detalle del anuncio</h2>
              <p><b>ID:</b> {modalAnuncio.id}</p>
              <p><b>Precio del producto:</b> {modalAnuncio.precio_servicio || '-'}</p>
              <p><b>Estado:</b> {modalAnuncio.estado}</p>
              <p><b>Usuario:</b> <UsuarioNombre usuarioId={modalAnuncio.usuario} /></p>
              <p><b>Servicio ID:</b> {modalAnuncio.servicio}</p>
              <p><b>Producto:</b> {modalAnuncio.producto || '-'}</p>
              <p><b>Contenido:</b> {modalAnuncio.contenido || '-'}</p>
              <p><b>Fecha inicio:</b> {modalAnuncio.fecha_inicio ? modalAnuncio.fecha_inicio.split('T')[0] : '-'}</p>
              <p><b>Fecha fin:</b> {modalAnuncio.fecha_fin ? modalAnuncio.fecha_fin.split('T')[0] : '-'}</p>
              <p><b>Precio servicio:</b> {modalAnuncio.precio_servicio || '-'}</p>
              <p><b>Imagen:</b> {modalAnuncio.imagen_url ? <a href={modalAnuncio.imagen_url} target="_blank" rel="noopener noreferrer">{modalAnuncio.imagen_url}</a> : '-'}</p>
              <button onClick={() => setModalAnuncio(null)} className="publicity-modal-close">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


