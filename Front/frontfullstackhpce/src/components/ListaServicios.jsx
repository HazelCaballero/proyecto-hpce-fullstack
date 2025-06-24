import React from 'react';
import '../styles/Scomponents/ListaServicios.css';

export default function ListaServicios({ servicios, onEdit, onDelete }) {
  return (
    <div className="lista-servicios-container">
      <ul className="servicios-list">
        {servicios.length === 0 ? (
          <li>No hay servicios registrados.</li>
        ) : (
          servicios.map(s => (
            <li key={s.id} className="servicios-list-item">
              <div className='servicio'>
              <strong>Producto:</strong> {s.producto} <br />
              <strong> Días de anuncio:</strong> {s.dias_anuncio} <br />
              <strong> Monto pagado: </strong> {s.monto_pagado} <br />
              <strong> Precio del producto: </strong> {s.precio_producto} <br />
              <strong>Contenido:</strong> {s.contenido} <br />
              <strong> Precio de la publicidad: </strong> {s.precio_publicidad}<br />
              </div>

              <div className='botones'>
              <button onClick={() => onEdit(s)} className="servicios-btn-style"><img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /></button>
              <button onClick={() => onDelete(s.id)} className="servicios-btn-style"><img className='user-list-icon' src="../public/trash-removebg-preview.png" alt="trash-icon" /></button>
              </div>

            </li>
          ))
        )}
      </ul>
    </div>
  );
}
