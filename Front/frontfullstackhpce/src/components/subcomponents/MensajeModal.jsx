import React from 'react';
import '../../styles/Scomponents/MensajeModal.css';

// Modal para mostrar detalles de un mensaje
export default function MensajeModal({ mensaje, onClose }) {
  if (!mensaje) return null;
  return (
    <div className="modal">
      <h3>Mensaje</h3>
      <p>{mensaje.contenido}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
