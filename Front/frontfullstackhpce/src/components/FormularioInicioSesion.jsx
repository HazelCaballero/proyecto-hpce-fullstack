import React from 'react'
import "../styles/Scomponents/FormularioInicioSesion.css"

export default function FormularioInicioSesion() {
  return (
    <div className="formulario-inicio-sesion-container">
        <h1 className="formulario-titulo">Formulario de Inicio de Sesión</h1>
            <div className="formulario-inicio-sesion-form">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Nombre de usuario" required />

                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" required />
                
                <button type="submit">Iniciar Sesión</button>
            </div>
    </div>
  )
}

