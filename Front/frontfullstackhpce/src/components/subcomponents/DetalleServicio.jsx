import React from 'react';
import '../../styles/Scomponents/DetalleServicio.css';

// Vista de detalle de un servicio
export default function DetalleServicio({ servicio, onClose }) {
  if (!servicio) return null;
  return (
    <div className="modal">
      <h3>Detalle Servicio</h3>
      <p>Nombre: {servicio.nombre}</p>
      <p>Descripción: {servicio.descripcion}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
