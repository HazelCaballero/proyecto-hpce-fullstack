import React from 'react'

export default function FormularioInicioSesion() {
  return (
    <div>
        <h1>Formulario de Inicio de Sesión</h1>
            <div>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Nombre de usuario" required />

                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" required />
                
                <button type="submit">Iniciar Sesión</button>
            </div>
    </div>
  )
}

