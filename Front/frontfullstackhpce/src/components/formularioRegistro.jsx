import React from 'react'

export default function FormularioRegistro() {
  return (
    <div>
        <h1>Registro</h1>
        <div>     
                <label htmlFor="username">Nombre:</label>
                <input type="text" id="username" name="username" placeholder="Nombre de usuario" required />
                
                <label htmlFor="email">Correo:</label>
                <input type="email" id="email" name="email" placeholder="Correo" required />
                
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" required />
                
                <label htmlFor="phone">Teléfono:</label>
                <input type="text" id="phone" name="phone" placeholder="Teléfono" required />
                
                <button type="submit">Registrar</button>
        </div>

        
    </div>
  )
}