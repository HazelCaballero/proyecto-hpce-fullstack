import React from 'react';
import '../styles/Scomponents/MensajeModal.css';

// Modal para mostrar detalles de un mensaje
export default function MensajeModal({ mensaje, onClose }) {
  if (!mensaje) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Detalle del Mensaje</h3>
        <div className="mensaje-detalle-grid">
          <div><b>ID:</b></div><div>{mensaje.id}</div>
          <div><b>Usuario ID:</b></div><div>{mensaje.usuario}</div>
          <div><b>Nombre usuario:</b></div><div>{mensaje.usuario_nombre}</div>
          <div><b>Email usuario:</b></div><div>{mensaje.usuario_email}</div>
          <div><b>Correo:</b></div><div>{mensaje.correo}</div>
          <div><b>Promocionarse:</b></div><div>{mensaje.promocionarse ? 'Sí' : 'No'}</div>
          <div><b>Mensaje:</b></div><div style={{whiteSpace:'pre-line'}}>{mensaje.contenido || mensaje.mensaje}</div>
          <div><b>Fecha de envío:</b></div><div>{mensaje.fecha_envio}</div>
          <div><b>Leído:</b></div><div>{mensaje.leido ? 'Sí' : 'No'}</div>
        </div>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
