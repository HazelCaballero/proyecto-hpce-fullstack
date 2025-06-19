import React from 'react';
import '../styles/Scomponents/PublicacionModal.css';

// Modal para mostrar detalles de una publicación
export default function PublicacionModal({ publicacion, onClose }) {
  if (!publicacion) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Detalle Publicación</h3>
        <p><b>ID:</b> {publicacion.id}</p>
        <p><b>Título:</b> {publicacion.titulo}</p>
        <p><b>Contenido:</b> {publicacion.publicacion}</p>
        <p><b>Usuario:</b> {publicacion.usuario}</p>
        {publicacion.imagen_url && (
          <p><b>Imagen:</b> <a href={publicacion.imagen_url} target="_blank" rel="noopener noreferrer">{publicacion.imagen_url}</a></p>
        )}
        <button onClick={onClose} className="close-btn">Cerrar</button>
      </div>
    </div>
  );
}
