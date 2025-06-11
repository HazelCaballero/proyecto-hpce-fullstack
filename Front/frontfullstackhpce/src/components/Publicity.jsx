// al crear anuncios no se ven hasta que se refresca la página debo arreglarlo e igual al mostrar
// un anuncio activo o sesactivarlo no se actualiza hasta que se refresca la página
// el precio del anuncio debe poder ser un nuero mas grande
import React, { useState, useEffect } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import CallsPublicidades from '../services/CallsPublicidades';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';

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
    if (!form.producto || !form.contenido || !form.precio || !form.servicioId) {
      Swal.fire('Error', 'Completa todos los campos y selecciona un servicio', 'error');
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
    <div className="form-anuncio">
      <h3>Postear anuncio</h3>
      <div>
        <label htmlFor="Producto">Producto</label>
        <select
          id="Producto"
          name="producto"
          value={form.producto}
          onChange={e => {
            const selectedServicio = servicios.find(s => s.producto === e.target.value);
            setForm({
              ...form,
              producto: e.target.value,
              contenido: selectedServicio ? selectedServicio.contenido : '',
              servicioId: selectedServicio ? selectedServicio.id : ''
            });
          }}
        >
          <option value="">Selecciona un producto</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.producto}>
              {servicio.producto || `Servicio ${servicio.id}`}
            </option>
          ))}
        </select>
        <label htmlFor="Contenido">Contenido</label>
        <input
          type="text"
          id="Contenido"
          name="contenido"
          placeholder="Contenido"
          value={form.contenido}
          readOnly
        />
        <label htmlFor="Precio">Precio</label>
        <input
          type="text"
          id="Precio"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        />
        <label htmlFor="Imagen">Imagen</label>
        <input
          type="text"
          id="Imagen"
          name="imagen"
          placeholder="Imagen"
          value={form.imagen}
          onChange={handleChange}
        />
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
                        
                        const dataToSend = {
                          precio_publicidad: anuncio.precio_publicidad,
                          servicio: anuncio.servicio,
                          usuario: anuncio.usuario,
                          estado: nuevoEstado
                        };
                        await CallsPublicidades.UpdatePublicidad(anuncio.id, dataToSend);
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
