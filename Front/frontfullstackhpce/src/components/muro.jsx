import React from 'react'
import '../styles/Scomponents/Muro.css'

export default function Muro() {
  return (
    <div className="muro-container">
      <div className="muro-publicaciones">
        <h2>Publicaciones</h2>
        <div className="muro-publicar">Publicar</div>
        <div className="muro-lista">Publicaciones</div>
      </div>
      <div className="muro-publicidad">
        <h2>Publicidad</h2>
        <div className="muro-anuncio">Anuncio</div>
      </div>
    </div>
  )
}
