import React from 'react'
import '../styles/Scomponents/FormularioContacto.css'

export default function FormularioContacto() {
  return (
    <div className="formulario-contacto-container">
        <h1 className="formulario-titulo">Formulario de Contacto</h1>
        <form className="formulario-contacto-form">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="mensaje">Mensaje:</label>
            <textarea id="mensaje" name="mensaje" required></textarea>

            <button type="submit">Enviar</button>
        </form>
    </div>
  )
}
