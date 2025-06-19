import React, { useEffect, useState } from 'react';
import '../styles/Scomponents/APublicaciones.css';
import CallsPublicaciones from '../services/CallsPublicaciones';
import CallsUsuarias from '../services/CallsUsuarias';
import Swal from 'sweetalert2';
import PublicacionesLista from './PublicacionesLista';
import PublicacionModal from './PublicacionModal';
import UsuarioNombre from './UsuarioNombre';

/**
 * Componente de administración de publicaciones.
 * Permite ver, gestionar y mostrar detalles de publicaciones y usuarias.
 */
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

  const rol = localStorage.getItem('rol');
  const isSuperUser = localStorage.getItem('is_superuser') === 'true';
  const isSuperOrMod = isSuperUser || rol === 'superusuario' || rol === 'moderador';

  return (
    <div className="apublicaciones-container">
      <PublicacionesLista
        publicaciones={publicaciones}
        onSelect={setModalPub}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSuperOrMod={isSuperOrMod}
      />
      {modalPub && (
        <PublicacionModal publicacion={modalPub} onClose={() => setModalPub(null)} />
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
