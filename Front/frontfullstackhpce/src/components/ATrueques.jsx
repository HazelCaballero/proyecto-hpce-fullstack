import React from 'react'
import '../styles/Scomponents/ATrueques.css'

export default function Trueques() {
  return (
    <div className="trueques-container">
      <ul className="trueques-list">
        <h3>Lista de truques</h3>
        <li>Trueque 1</li>
        <li>Trueque 2</li>
        <li>Trueque 3</li>
      </ul>

      <div className="trueques-info">
        <h2>N° de trueques activos</h2>
        <p className="trueques-num">5</p>
        <h2>N° de trueques registrados</h2>
        <p className="trueques-num">20</p>
      </div>
    </div>    
  );
}  

