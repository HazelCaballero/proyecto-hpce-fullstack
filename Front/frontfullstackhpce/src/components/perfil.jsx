import React from 'react'
import '../styles/Scomponents/Perfil.css'

export default function Perfil() {
  return (
    <div className="perfil-container">
      <h1 className="perfil-nombre">Nombre usuaria</h1>
      <div className="perfil-img-wrapper">
        <img src="../public/Screenshot_2025-05-22_082701-removebg-preview.png" alt="profilePicture" className="perfil-img" />
      </div>
      <div>
        <ul className="perfil-lista">
          <li><strong>Nombre:</strong> Usuaria</li>
          <li><strong>Fecha Nacimiento:</strong> 01/01/2000</li>
          <li><strong>Intereses:</strong> Lectura, Viajes, Tecnología</li>
          <li><strong>Ubicación:</strong> Ciudad, País</li>
          <li><strong>Aportaciones:</strong> 10</li>
          <li className="perfil-eliminar">Eliminar</li>
        </ul>
      </div>
    </div>
  )
}
