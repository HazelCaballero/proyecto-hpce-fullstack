import React from 'react'

export default function formularioContacto() {
  return (
    <div>
        <h1>Formulario de Contacto</h1>
        <div>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea id="mensaje" name="mensaje" required></textarea>
            
            <button type="submit">Enviar</button>
        </div>
    </div>
  )
}


// Nombre Usuaria

//Correo Electrónico

//Mensaje

//¿Interesada en promocionarse? Boolean