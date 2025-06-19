// al crear anuncios no se ven hasta que se refresca la página debo arreglarlo e igual al mostrar
// un anuncio activo o sesactivarlo no se actualiza hasta que se refresca la página
// el precio del anuncio debe poder ser un nuero mas grande
import React, { useState, useEffect } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import CallsPublicidades from '../services/CallsPublicidades';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';
import '../styles/Scomponents/Publicity.css';

/**
 * Componente para crear y gestionar anuncios/publicidades.
 * Permite crear, editar, activar/desactivar y ver detalles de anuncios.
 */
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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrearAnuncio = async () => {
    // Solo se requiere seleccionar un servicio
    if (!form.servicioId) {
      Swal.fire('Error', 'Selecciona un servicio para publicar el anuncio', 'error');
      return;
    }
    setLoading(true);
    try {
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      // Buscar el servicio seleccionado para tomar los datos necesarios
      const servicioSeleccionado = servicios.find(s => s.id === Number(form.servicioId));
      if (!servicioSeleccionado) {
        Swal.fire('Error', 'Servicio no encontrado', 'error');
        setLoading(false);
        return;
      }
      const dataToSend = {
        servicio: servicioSeleccionado.id,
        usuario: usuarioId,
        estado: 'activada' // Cambiar el estado a activada al crear el anuncio
      };
      if (editPubId) {
        await CallsPublicidades.UpdatePublicidad(editPubId, dataToSend);
        setEditPubId(null);
      } else {
        await CallsPublicidades.PostPublicidad(dataToSend);
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
        const data = await CallsPublicidades.GetPublicidad();
        setPublicidades(Array.isArray(data) ? data : []);
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
    <div className="publicity-containers-row">
      <div className="adminpub-section">
        <h2>Publicación de anuncio</h2>
        <form className="form-anuncio-form" onSubmit={e => { e.preventDefault(); handleCrearAnuncio(); }}>
          <div className="form-anuncio-group">
            <label htmlFor="servicioId">Servicio</label>
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
          {/* Mostrar datos de solo lectura */}
          <div className="form-anuncio-group">
            <label>Producto</label>
            <input type="text" value={form.producto || ''} readOnly />
          </div>
          <div className="form-anuncio-group">
            <label>Contenido del anuncio</label>
            <input
              type="text"
              name="contenido"
              value={form.contenido || ''}
              readOnly
            />
          </div>
          <div className="form-anuncio-group">
            <label>Fecha inicio</label>
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
      <div className="adminpub-section">
        <h2>Lista de anuncios</h2>
        <ul>
          {publicidades.length === 0 ? (
            <li>No hay anuncios</li>
          ) : (
            publicidades.map((ad, idx) => (
              <li key={ad.id || idx} className="publicity-list-item">
                <div><b>Precio:</b> {ad.precio_publicidad}</div>
                <div>
                  <b>Estado:</b>
                  <label className="publicity-label">
                    <input
                      type="checkbox"
                      checked={ad.estado === 'activada'}
                      onChange={async (e) => {
                        const nuevoEstado = e.target.checked ? 'activada' : 'desactivada';
                        try {
                          await CallsPublicidades.UpdatePublicidad(ad.id, { ...ad, estado: nuevoEstado });
                          setPublicidades(publicidades =>
                            publicidades.map(p =>
                              p.id === ad.id ? { ...p, estado: nuevoEstado } : p
                            )
                          );
                        } catch (err) {
                          Swal.fire('Error', 'Error al actualizar el estado', 'error');
                        }
                      }}
                    />
                    {' '}{ad.estado}
                  </label>
                </div>
                <div>
                  <b>Usuario:</b> <UsuarioNombre usuarioId={ad.usuario} />
                </div>
                <div>
                  <b>Servicio ID:</b> {ad.servicio}
                </div>
                <div className="publicity-actions">
                  <button onClick={() => setModalAnuncio(ad)} className="publicity-btn">Ver</button>
                  <button onClick={async () => {
                    if (!window.confirm('¿Seguro que deseas eliminar este anuncio?')) return;
                    try {
                      await CallsPublicidades.DeletePublicidad(ad.id);
                      setPublicidades(publicidades => publicidades.filter(p => p.id !== ad.id));
                    } catch (err) {
                      Swal.fire('Error', 'Error al eliminar el anuncio', 'error');
                    }
                  }}>Eliminar</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    
      {modalAnuncio && (
        <div className="publicity-modal">
          <div className="publicity-modal-content">
            <h2>Detalle del anuncio</h2>
            <p><b>ID:</b> {modalAnuncio.id}</p>
            <p><b>Precio:</b> {modalAnuncio.precio_publicidad}</p>
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
  );
}
