import React, { useEffect, useState } from 'react'
import '../styles/Scomponents/AContactos.css';
import CallsContactos from '../services/CallsContactos'
import CallsPublicidades from '../services/CallsPublicidades'
import CallsUsuarias from '../services/CallsUsuarias'
import CallsServicios from '../services/CallsServicios'
import Swal from 'sweetalert2';
import MensajeModal from './subcomponents/MensajeModal';
import DetalleUsuaria from './subcomponents/DetalleUsuaria';
import DetalleServicio from './subcomponents/DetalleServicio';

/**
 * Componente de administración de contactos.
 * Permite ver, eliminar y gestionar mensajes de contacto, así como crear anuncios y ver detalles de usuarias y servicios.
 */
export default function Contactos() {
  const [mensajes, setMensajes] = useState([]);
  const [publicidades, setPublicidades] = useState([]);
  const [form, setForm] = useState({
    producto: '',
    contenido: '',
    precio: '',
    imagen: ''
  });
  const [modalMsg, setModalMsg] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [usuarioDetalle, setUsuarioDetalle] = useState(null);
  const [servicioDetalle, setServicioDetalle] = useState(null);

  useEffect(() => {
    CallsContactos.GetContactos()
      .then(data => setMensajes(data))
      .catch(() => setMensajes([]));

    CallsPublicidades.GetPublicidad()
      .then(data => {
        console.log("Anuncios recibidos:", data);
        setPublicidades(data);
      })
      .catch(() => setPublicidades([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.id.toLowerCase()]: e.target.value });
  };

  const handleCrearAnuncio = async () => {
    try {
      await CallsPublicidades.PostPublicidad(form);
      CallsPublicidades.GetPublicidad()
        .then(data => setPublicidades(data));
      setForm({ producto: '', contenido: '', precio: '', imagen: '' });
    } catch (error) {
      Swal.fire('Error', 'Error al crear el anuncio', 'error');
    }
  };

  const handleEliminarMensaje = async (id) => {
    if (eliminando) return;
    const result = await Swal.fire({
      title: '¿Seguro que deseas eliminar este mensaje?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    setEliminando(true);
    try {
      await CallsContactos.DeleteContacto(id);
      setMensajes(mensajes => mensajes.filter(m => m.id !== id));
    } catch (e) {
      Swal.fire('Error', 'Error al eliminar el mensaje', 'error');
    } finally {
      setEliminando(false);
    }
  };

  const obtenerNombreUsuario = async (usuarioId) => {
    try {
      const usuario = await CallsUsuarias.GetUsuaria(usuarioId);
      return usuario.nombre || usuario.username || usuario.email || usuarioId;
    } catch {
      return usuarioId;
    }
  };


  useEffect(() => {
    if (modalMsg && modalMsg.precio_publicidad) {
      setUsuarioDetalle(null);
      setServicioDetalle(null);
      obtenerNombreUsuario(modalMsg.usuario).then(nombre => setUsuarioDetalle(nombre));
      CallsServicios.GetServicio(modalMsg.servicio)
        .then(data => setServicioDetalle(data))
        .catch(() => setServicioDetalle(null));
    }
  }, [modalMsg]);

  return (
    <div className="container-contactos">

      <div className='resumen'>
        <h2>Mensajes por revisar</h2>
        <p>{mensajes.filter(m => !m.leido).length}</p>
        <h2>Mensajes revisados</h2>
        <p>{mensajes.filter(m => m.leido).length}</p>
      </div>

      <ul>
        <h3>Mensajes por revisar</h3>
        {mensajes.filter(m => !m.leido).length === 0 ? (
          <li>No hay mensajes por revisar</li>
        ) : (
          mensajes.filter(m => !m.leido).map((msg, idx) => (
            <li key={msg.id || idx}>
              mensaje: {msg.contenido || msg.mensaje || '-'}<br />
              usuaria: {msg.usuario_nombre || msg.usuaria || msg.usuario || '-'}<br />
              Promocionarse: {(msg.promocionarse === true || msg.promocionarse === 'si' || msg.promocionarse === 'sí') ? 'sí' : 'no'}<br />
              <label style={{marginRight:8}}>
                <input
                  type="checkbox"
                  checked={!!msg.leido}
                  onChange={async (e) => {
                    const nuevoLeido = e.target.checked;
                    try {
                      await CallsContactos.UpdateContactos(msg.id, { ...msg, leido: nuevoLeido });
                      setMensajes(mensajes => mensajes.map(m => m.id === msg.id ? { ...m, leido: nuevoLeido } : m));
                    } catch (err) {
                      Swal.fire('Error', 'Error al actualizar el estado de leído', 'error');
                    }
                  }}
                />
                {' '}Leído
              </label>
              <button style={{marginRight:8}} onClick={() => setModalMsg(msg)}>Ver</button>
              <button onClick={() => handleEliminarMensaje(msg.id)} disabled={eliminando}>Eliminar</button>
            </li>
          ))
        )}
      </ul>

      <ul>
        <h3>Mensajes revisados</h3>
        {mensajes.filter(m => m.leido).length === 0 ? (
          <li>No hay mensajes revisados</li>
        ) : (
          mensajes.filter(m => m.leido).map((msg, idx) => (
            <li key={msg.id || idx}>
              mensaje: {msg.contenido || msg.mensaje || '-'}<br />
              usuaria: {msg.usuario_nombre || msg.usuaria || msg.usuario || '-'}<br />
              Promocionarse: {(msg.promocionarse === true || msg.promocionarse === 'si' || msg.promocionarse === 'sí') ? 'sí' : 'no'}<br />
              <label style={{marginRight:8}}>
                <input
                  type="checkbox"
                  checked={!!msg.leido}
                  onChange={async (e) => {
                    const nuevoLeido = e.target.checked;
                    try {
                      await CallsContactos.UpdateContactos(msg.id, { ...msg, leido: nuevoLeido });
                      setMensajes(mensajes => mensajes.map(m => m.id === msg.id ? { ...m, leido: nuevoLeido } : m));
                    } catch (err) {
                      Swal.fire('Error', 'Error al actualizar el estado de leído', 'error');
                    }
                  }}
                />
                {' '}Leído
              </label>
              <button style={{marginRight:8}} onClick={() => setModalMsg(msg)}>Ver</button>
              <button onClick={() => handleEliminarMensaje(msg.id)} disabled={eliminando}>Eliminar</button>
            </li>
          ))
        )}
      </ul>

      {/* Modal de mensaje */}
      <MensajeModal mensaje={modalMsg} onClose={() => setModalMsg(null)} />

      {/* Detalle de usuaria y servicio (solo si hay modalMsg y precio_publicidad) */}
      {modalMsg && modalMsg.precio_publicidad && (
        <>
          <DetalleUsuaria usuaria={usuarioDetalle ? {nombre: usuarioDetalle} : null} onClose={() => setModalMsg(null)} />
          <DetalleServicio servicio={servicioDetalle} onClose={() => setModalMsg(null)} />
        </>
      )}
    </div>
  );
}
