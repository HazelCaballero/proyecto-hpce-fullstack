import React, { useEffect, useState } from 'react';
import "../styles/Scomponents/APublicaciones.css";
import CallsPublicaciones from '../services/CallsPublicaciones';
import CallsUsuarias from '../services/CallsUsuarias';
import Swal from 'sweetalert2';

/**
 * Componente de administración de publicaciones.
 * Permite ver, gestionar y mostrar detalles de publicaciones y usuarias.
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


export default function APublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [modalPub, setModalPub] = useState(null);

  const cargarPublicaciones = () => {
    CallsPublicaciones.GetPublicaciones()
      .then(async data => {
        setPublicaciones(Array.isArray(data) ? data : []);
        
        const ids = Array.from(new Set((data || []).map(p => p.usuario)));
        const usuariosObj = {};
        await Promise.all(ids.map(async id => {
          try {
            const u = await CallsUsuarias.GetUsuaria(id);
            usuariosObj[id] = u;
          } catch {
            usuariosObj[id] = { username: id };
          }
        }));
        setUsuarios(usuariosObj);
      })
      .catch(() => setPublicaciones([]));
  };

  useEffect(() => { cargarPublicaciones(); }, []);

  const handleEdit = async pub => {
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
        };
      }
    });
    if (formValues) {
      try {
        await CallsPublicaciones.UpdatePublicaciones(pub.id, { ...pub, ...formValues });
        cargarPublicaciones();
        Swal.fire('Actualizado', 'La publicación ha sido actualizada.', 'success');
      } catch (e) {
        Swal.fire('Error', 'No se pudo actualizar la publicación.', 'error');
      }
    }
  };

  const handleDelete = async pub => {
    const confirm = await Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await CallsPublicaciones.DeletePublicaciones(pub.id);
        setPublicaciones(publicaciones => publicaciones.filter(p => p.id !== pub.id));
        Swal.fire('Eliminada', 'La publicación ha sido eliminada.', 'success');
      } catch (e) {
        Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
      }
    }
  };

  return (
    <div className="publicaciones-container">
      <ul className="publicaciones-list">
        <h3>Lista de publicaciones</h3>
        {publicaciones.length === 0 ? (
          <li>No hay publicaciones</li>
        ) : (
          publicaciones.map(pub => (
            <li key={pub.id} style={{ marginBottom: 12, border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
              <div style={{fontSize:13, color:'#888', marginBottom:4}}>
                Publicado por: <b><UsuarioNombre usuarioId={pub.usuario} /></b>
              </div>
              <b>{pub.titulo}</b>
              <div>{pub.publicacion}</div>
              {pub.imagen_url && <img src={pub.imagen_url} alt="imagen" style={{maxWidth:'100%',maxHeight:200,marginTop:8}} />}
              <div style={{marginTop:8}}>
                <button onClick={() => setModalPub(pub)} style={{marginRight:8}}>Ver</button>
                <button onClick={() => handleEdit(pub)} style={{marginRight:8}}>Editar</button>
                <button onClick={() => handleDelete(pub)} style={{color:'red'}}>Eliminar</button>
              </div>
            </li>
          ))
        )}
      </ul>

      {modalPub && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,maxWidth:400}}>
            <h2>Detalle de la publicación</h2>
            <p><b>ID:</b> {modalPub.id}</p>
            <p><b>Título:</b> {modalPub.titulo}</p>
            <p><b>Contenido:</b> {modalPub.publicacion}</p>
            <p><b>Usuario:</b> <UsuarioNombre usuarioId={modalPub.usuario} /></p>
            {modalPub.imagen_url && (
              <p><b>Imagen:</b> <a href={modalPub.imagen_url} target="_blank" rel="noopener noreferrer">{modalPub.imagen_url}</a></p>
            )}
            <button onClick={() => setModalPub(null)} style={{marginTop:8}}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="publicaciones-info">
        <h2>N° de publicaciones activas</h2>
        <p>{publicaciones.length}</p>
        <h2>N° de usuarias registradas en publicaciones</h2>
        <p>{Object.keys(usuarios).length}</p>
      </div>
    </div>
  );
}
