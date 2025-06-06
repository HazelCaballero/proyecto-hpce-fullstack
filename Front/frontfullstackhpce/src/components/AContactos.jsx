import React, { useEffect, useState } from 'react'
import "../styles/Scomponents/AContactos.css"
import CallsContactos from '../services/CallsContactos'
import CallsPublicidades from '../services/CallsPublicidades'


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

 
  useEffect(() => {
    
    CallsContactos.GetContactos()
      .then(data => setMensajes(data))
      .catch(() => setMensajes([]));
  
    fetch('/api/publicidades')
      .then(res => res.json())
      .then(data => setPublicidades(data))
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

      <ul>
        <h3>Lista de anuncios</h3>
        {publicidades.length === 0 ? (
          <li>No hay anuncios</li>
        ) : (
          publicidades.map((ad, idx) => (
            <li key={ad.id || idx}>
              {ad.producto ? `${ad.producto}: ${ad.contenido}` : JSON.stringify(ad)}
            </li>
          ))
        )}
      </ul>
      
      
    </div>
  )
}
