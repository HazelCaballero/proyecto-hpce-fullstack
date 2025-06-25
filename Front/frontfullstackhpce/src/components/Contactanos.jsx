import React from 'react'
import FormularioContacto from './FormularioContacto'
import '../styles/Scomponents/Contactanos.css' 

/**
 * Componente de página de contacto.
 * Muestra el formulario de contacto, información de la fundadora y horario de atención.
 */
export default function Contactanos() {
  return (
    <div className="contactanos-container">

        <div className="contactanos-form">
            <FormularioContacto/>
        </div>

        <div className="contactanos-fundadora">
            <img src="../public/Screenshot_2025-05-23_085738-removebg-preview.png" alt="Fundadora Hazel Caballero" />
            <h3>Fundadora Hazel Caballero</h3>
        </div>
        
        <div className="contactanos-horario">
          <h4>Horario</h4>
          <p>Lunes a Viernes 10:00 am a 6:00 pm, Sábados de 11:00 am a 5:00 pm</p>
        </div>
    </div>
  )
}
