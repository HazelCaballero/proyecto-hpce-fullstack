import React from 'react'

export default function PerfilAcionDos ({onEliminar}) {
  return (
    <div>
         {/* Botón para eliminar el perfil */}
      <li className="perfil-eliminar" onClick={onEliminar}>
       <strong>Eliminar perfil</strong> 
      </li>
    </div>
  )
}
