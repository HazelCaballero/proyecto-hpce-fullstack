import React, { useEffect, useState } from 'react'
import "../styles/Scomponents/AContactos.css"
import CallsContactos from '../services/CallsContactos'
import CallsPublicidades from '../services/CallsPublicidades'
import CallsUsuarias from '../services/CallsUsuarias'
import CallsServicios from '../services/CallsServicios'

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
      alert('Error al crear el anuncio');
    }
  };

  const handleEliminarMensaje = async (id) => {
    if (eliminando) return;
    if (!window.confirm('¿Seguro que deseas eliminar este mensaje?')) return;
    setEliminando(true);
    try {
      await CallsContactos.DeleteContacto(id);
      setMensajes(mensajes => mensajes.filter(m => m.id !== id));
    } catch (e) {
      alert('Error al eliminar el mensaje');
    } finally {
      setEliminando(false);
    }
  };

  // Función para obtener el nombre del usuario por id
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
        <h2>Mensajes a revisar</h2>
        <p>{mensajes.length}</p>
        <h2>Publicidad por aprobar</h2>
        <p>{publicidades.length}</p>
      </div>

      <ul>
        <h3>Lista de Mensajes</h3>
        {mensajes.length === 0 ? (
          <li>No hay mensajes</li>
        ) : (
          mensajes.map((msg, idx) => (
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
                      alert('Error al actualizar el estado de leído');
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

      {modalMsg && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,maxWidth:400}}>
            <h2>Detalle del mensaje</h2>
            <p><b>ID:</b> {modalMsg.id}</p>
            <p><b>Mensaje:</b> {modalMsg.contenido || modalMsg.mensaje || '-'}</p>
            <p><b>Usuaria:</b> {modalMsg.usuario_nombre || modalMsg.usuaria || modalMsg.usuario || '-'}</p>
            <p><b>Correo:</b> {modalMsg.correo || '-'}</p>
            <p><b>Promocionarse:</b> {(modalMsg.promocionarse === true || modalMsg.promocionarse === 'si' || modalMsg.promocionarse === 'sí') ? 'sí' : 'no'}</p>
            <p><b>Fecha:</b> {modalMsg.fecha || modalMsg.created_at || modalMsg.fecha_envio || '-'}</p>
            <p><b>Leído:</b> {modalMsg.leido ? 'Sí' : 'No'}</p>
            <button onClick={() => setModalMsg(null)} style={{marginTop:8}}>Cerrar</button>
          </div>
        </div>
      )}

      {modalMsg && modalMsg.precio_publicidad ? (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,maxWidth:400}}>
            <h2>Detalle del anuncio</h2>
            <p><b>ID:</b> {modalMsg.id}</p>
            <p><b>Precio:</b> {modalMsg.precio_publicidad}</p>
            <p><b>Estado:</b> {modalMsg.estado}</p>
            <p><b>Usuario:</b> {usuarioDetalle !== null ? usuarioDetalle : 'Cargando...'}</p>
            <p><b>Servicio ID:</b> {modalMsg.servicio}</p>
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
            <button onClick={() => setModalMsg(null)} style={{marginTop:8}}>Cerrar</button>
          </div>
        </div>
      ) : null}

      <ul>
        <h3>Lista de anuncios</h3>
        {publicidades.length === 0 ? (
          <li>No hay anuncios</li>
        ) : (
          publicidades.map((ad, idx) => (
            <li key={ad.id || idx}>
              precio: {ad.precio_publicidad}<br />
              estado: 
              <label>
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
                      alert('Error al actualizar el estado');
                    }
                  }}
                />
                {' '}{ad.estado}
              </label>
              <br />
              usuario: 
              <UsuarioNombre usuarioId={ad.usuario} />
              <br />
              <button style={{marginRight:8}} onClick={() => setModalMsg(ad)}>Ver</button>
              <button onClick={async () => {
                if (!window.confirm('¿Seguro que deseas eliminar este anuncio?')) return;
                try {
                  await CallsPublicidades.DeletePublicidad(ad.id);
                  setPublicidades(publicidades => publicidades.filter(p => p.id !== ad.id));
                } catch (err) {
                  alert('Error al eliminar el anuncio');
                }
              }}>Eliminar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

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
