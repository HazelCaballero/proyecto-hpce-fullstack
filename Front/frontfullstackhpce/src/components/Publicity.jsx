import React, { useState, useEffect } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import CallsPublicidades from '../services/CallsPublicidades';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';

// Componente para mostrar el nombre del usuario
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
  // Fetch service details when modalAnuncio changes
  useEffect(() => {
    if (modalAnuncio && modalAnuncio.servicio) {
      setServicioDetalle(null);
      CallsServicios.GetServicio(modalAnuncio.servicio)
        .then(data => setServicioDetalle(data))
        .catch(() => setServicioDetalle(null));
    }
  }, [modalAnuncio]);

  useEffect(() => {
    // Obtener servicios al montar el componente
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
    // Obtener publicidades al montar el componente
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
    if (!form.producto || !form.contenido || !form.precio || !form.servicioId) {
      alert('Completa todos los campos y selecciona un servicio');
      return;
    }
    setLoading(true);
    try {
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      const dataToSend = {
        precio_publicidad: Number(form.precio),
        servicio: Number(form.servicioId),
        usuario: usuarioId
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
      console.log('Error posting publicidad:', error, error.response?.data);
      if (error.response && error.response.data) {
        alert('Error: ' + JSON.stringify(error.response.data));
      } else {
        alert('Error al crear el anuncio');
      }
    }
    setLoading(false);
  };


  // Edición con SweetAlert2
  const handleEditPublicidad = async (anuncio) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar anuncio',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Producto" value="${anuncio.producto || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Contenido" value="${anuncio.contenido || ''}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Precio" type="number" value="${anuncio.precio_publicidad || ''}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Imagen (URL)" value="${anuncio.imagen || ''}">` +
        `<select id="swal-input5" class="swal2-input">` +
        servicios.map(s => `<option value="${s.id}" ${anuncio.servicio === s.id ? 'selected' : ''}>${s.producto || `Servicio ${s.id}`}</option>`).join('') +
        `</select>`,
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
          document.getElementById('swal-input5').value
        ];
      }
    });
    if (formValues) {
      const [producto, contenido, precio, imagen, servicioId] = formValues;
      if (!producto.trim() || !contenido.trim() || !precio || !servicioId) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
        return;
      }
      try {
        const usuarioId = Number(localStorage.getItem('usuario_id'));
        const dataToSend = {
          producto,
          contenido,
          precio_publicidad: Number(precio),
          imagen,
          servicio: Number(servicioId),
          usuario: usuarioId
        };
        await CallsPublicidades.UpdatePublicidad(anuncio.id, dataToSend);
        Swal.fire('Actualizado', 'El anuncio ha sido actualizado.', 'success');
        // Refrescar lista
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
    <div className="form-anuncio">
      <h3>Postear anuncio</h3>
      <div>
        <label htmlFor="Producto">Producto</label>
        <input
          type="text"
          id="Producto"
          placeholder="Producto"
          value={form.producto}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Contenido">Contenido</label>
        <input
          type="text"
          id="Contenido"
          placeholder="Contenido"
          value={form.contenido}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Precio">Precio</label>
        <input
          type="text"
          id="Precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Imagen">Imagen</label>
        <input
          type="text"
          id="Imagen"
          placeholder="Imagen"
          value={form.imagen}
          onChange={handleChange}
        /> <br />
        <label htmlFor="ServicioId">Servicio</label>
        <select
          name="servicioId"
          value={form.servicioId}
          onChange={handleChange}
        >
          <option value="">Selecciona un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.producto || `Servicio ${servicio.id}`}
            </option>
          ))}
        </select>
        <br />
        <button onClick={handleCrearAnuncio} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Anuncio'}
        </button>
      </div>
      <hr />
      <h3>Anuncios existentes</h3>
      <ul>
        {Array.isArray(publicidades) && publicidades.length === 0 ? (
          <li>No hay anuncios registrados.</li>
        ) : (
          publicidades.map(anuncio => (
            <li key={anuncio.id} style={{ marginBottom: 16, border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
              <div><b>Precio:</b> {anuncio.precio_publicidad}</div>
              <div>
                <b>Estado:</b>
                <label style={{marginLeft: 6}}>
                  <input
                    type="checkbox"
                    checked={anuncio.estado === 'activada'}
                    onChange={async (e) => {
                      const nuevoEstado = e.target.checked ? 'activada' : 'desactivada';
                      try {
                        await CallsPublicidades.UpdatePublicidad(anuncio.id, { ...anuncio, estado: nuevoEstado });
                        setPublicidades(publicidades =>
                          publicidades.map(p =>
                            p.id === anuncio.id ? { ...p, estado: nuevoEstado } : p
                          )
                        );
                      } catch (err) {
                        Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
                      }
                    }}
                  />
                  {' '}{anuncio.estado}
                </label>
              </div>
              <div>
                <b>Usuario:</b> <UsuarioNombre usuarioId={anuncio.usuario} />
              </div>
              <div>
                <b>Servicio ID:</b> {anuncio.servicio}
              </div>
              <div style={{marginTop:8}}>
                <button onClick={() => setModalAnuncio(anuncio)} style={{ marginRight: 8 }}>Ver</button>
                <button onClick={() => handleEditPublicidad(anuncio)} style={{ marginRight: 8 }}>Editar</button>
                <button onClick={() => handleDeletePublicidad(anuncio.id)}>Eliminar</button>
              </div>
            </li>
          ))
        )}
      </ul>
      {/* Modal de detalles del anuncio */}
      {modalAnuncio && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,maxWidth:400}}>
            <h2>Detalle del anuncio</h2>
            <p><b>ID:</b> {modalAnuncio.id}</p>
            <p><b>Precio:</b> {modalAnuncio.precio_publicidad}</p>
            <p><b>Estado:</b> {modalAnuncio.estado}</p>
            <p><b>Usuario ID:</b> {modalAnuncio.usuario}</p>
            <p><b>Servicio ID:</b> {modalAnuncio.servicio}</p>
            {servicioDetalle ? (
              <>
                <p><b>Producto:</b> {servicioDetalle.producto || '-'}</p>
                <p><b>Contenido:</b> {servicioDetalle.contenido || '-'}</p>
                <p><b>Fecha inicio:</b> {servicioDetalle.fecha_inicio ? servicioDetalle.fecha_inicio.split('T')[0] : '-'}</p>
                <p><b>Fecha fin:</b> {servicioDetalle.fecha_fin ? servicioDetalle.fecha_fin.split('T')[0] : '-'}</p>
                <p><b>Precio servicio:</b> {servicioDetalle.precio_servicio || '-'}</p>
                <p><b>Imagen:</b> {servicioDetalle.imagen_url ? <a href={servicioDetalle.imagen_url} target="_blank" rel="noopener noreferrer">{servicioDetalle.imagen_url}</a> : '-'}</p>
              </>
            ) : (
              <p>Cargando datos del servicio...</p>
            )}
            <button onClick={() => setModalAnuncio(null)} style={{marginTop:8}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
