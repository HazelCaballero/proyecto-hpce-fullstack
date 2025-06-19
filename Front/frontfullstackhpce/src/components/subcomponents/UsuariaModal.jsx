import React from 'react';
import '../../styles/Scomponents/UsuariaModal.css';

// Modal para mostrar detalles de una usuaria
export default function UsuariaModal({ usuaria, onClose }) {
  if (!usuaria) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Detalle Usuaria</h3>
        <p><b>ID:</b> {usuaria.id}</p>
        <p><b>Nombre:</b> {usuaria.username || usuaria.nombre}</p>
        <p><b>Email:</b> {usuaria.email}</p>
        <p><b>Teléfono:</b> {usuaria.telefono}</p>
        <p><b>Fecha de nacimiento:</b> {usuaria.fecha_nacimiento}</p>
        <p><b>Intereses:</b> {usuaria.intereses}</p>
        <p><b>Ubicación:</b> {usuaria.ubicacion}</p>
        <p><b>Aportaciones:</b> {usuaria.aportaciones}</p>
        <p><b>Activa:</b> {usuaria.is_active ? 'Sí' : 'No'}</p>
        <button onClick={onClose} className="close-btn">Cerrar</button>
      </div>
    </div>
  );
}
