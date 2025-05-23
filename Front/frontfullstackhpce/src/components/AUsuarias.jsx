import React from 'react'
import '../styles/Scomponents/AUsuarias.css'

export default function Usuarias() {
  return (
    <div className="usuarias-container">
      <ul className="usuarias-list">
        <h3>Lista de usuarias</h3>
        <li>usuarias</li>
      </ul>

      <div className="usuarias-stats">
        <h2>N de usuarias activas</h2>
        <p className="usuarias-num">numero</p>
        <h2>N de usuarias registrados</h2>
        <p className="usuarias-num">numero</p>
      </div>
    </div>
  )
}
