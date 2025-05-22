import React from 'react'

export default function Contactos() {
  return (
    <div>
      
      <div>
        <h2>Mensajes a revisar</h2>
        <p>numero</p>
        <h2>Publicidad por aprobar</h2>
        <p>numero</p>
      </div>

      <ul>
        <h3>Lista de Mensajes</h3>
        <li> mensajes</li>
      </ul>

      <ul>
        <h3>Lista de anuncios</h3>
        <li>anuncios</li>
      </ul>
      
      <div>
        <label htmlFor="Producto"></label>
        <input type="text" id="Producto" placeholder="Producto" />
        <label htmlFor="Contenido"></label>
        <input type="text" id="Contenido" placeholder="Contenido" />
        <label htmlFor="Precio"></label>
        <input type="text" id="Precio" placeholder="Precio" />
        <label htmlFor="Imagen"></label>
        <input type="text" id="Imagen" placeholder="Imagen" />
        <button>Crear Anuncio</button>
      </div>
      
    </div>
  )
}
