import React from 'react'
import "../styles/Scomponents/APublicaciones.css"

export default function Publicaciones() {
  return (
    <div className="publicaciones-container">
      <ul className="publicaciones-list">
        <h3>Lista de publicaciones</h3>
        <li> publicaciones</li>
      </ul>

      <div className="publicaciones-info">
        <h2>N de publicaciones activas</h2>
        <p>numero</p>
        <h2>N de publicaciones registrados</h2>
        <p>numero</p>
      </div>
    </div>
  )
}
