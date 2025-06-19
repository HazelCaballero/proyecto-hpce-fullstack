import React from 'react';

export default function ListaServicios({ servicios, onEdit, onDelete }) {
  return (
    <div className="lista-servicios-container">
      <h3>Lista de servicios</h3>
      <ul className="servicios-list">
        {servicios.length === 0 ? (
          <li>No hay servicios registrados.</li>
        ) : (
          servicios.map(s => (
            <li key={s.id} className="servicios-list-item">
              <strong>Producto:</strong> {s.producto} <br />
              <strong>Contenido:</strong> {s.contenido} <br />
              <span>Precio del producto: {s.precio_producto} | Monto pagado: {s.monto_pagado} | Días de anuncio: {s.dias_anuncio} | Precio de la publicidad: {s.precio_publicidad}</span>
              <br />
              <button onClick={() => onEdit(s)} className="servicios-btn-edit">Editar</button>
              <button onClick={() => onDelete(s.id)} className="servicios-btn-delete">Eliminar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
