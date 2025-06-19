import React from 'react';
import '../styles/Scomponents/DetalleUsuaria.css';

// Vista de detalle de una usuaria
export default function DetalleUsuaria({ usuaria, onClose }) {
  if (!usuaria) return null;
  return (
    <div className="modal">
      <h3>Detalle Usuaria</h3>
      <p>Nombre: {usuaria.nombre}</p>
      <p>Email: {usuaria.email}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
