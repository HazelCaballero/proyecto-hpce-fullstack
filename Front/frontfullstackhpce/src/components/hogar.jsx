import React from 'react'
import '../styles/Scomponents/Hogar.css'

export default function Hogar() {
  return (
    <div className="hogar-container">
      <div className="hogar-section">
        <h2 className="hogar-title">Conexión Creativa</h2>
        <p className="hogar-text">
          Es una plataforma digital dedicada a fomentar el intercambio de conocimiento, bienes 
          y servicios entre mujeres de todas partes, mediante un sistema de trueque. Nuestro 
          objetivo es crear una comunidad inclusiva y colaborativa, donde las usuarias puedan 
          aprender, crecer y apoyar a otras mujeres sin necesidad de dinero, pero no limitando 
          el uso de este si así se desea.
        </p>
      </div>

      <div className="hogar-section">
        <h2 className="hogar-title">Misión</h2>
        <p className="hogar-text">
          Crear una plataforma que permita a las mujeres conectarse, compartir conocimientos y 
          experiencias
        </p>
      </div>

      <div className="hogar-section">
        <h2 className="hogar-title">Visión</h2>
        <p className="hogar-text">Una red global de mujeres conectadas</p>
      </div>

      <div className="hogar-section">
        <h2 className="hogar-title">Valores</h2>
        <ul className="hogar-list">
          <li>Respeto: Fomentamos el respeto en todas las interacciones</li>
          <li>Unión: Creemos en el trabajo como comunidad</li>
          <li>Inclusión: Aceptamos y valoramos la diversidad</li>
          <li>Creatividad: Incentivamos la creatividad</li>
          <li>Educación: Promovemos el acceso libre a recursos educativos</li>
          <li>Libertad:  Las mujeres eligen su futuro</li>
        </ul>
      </div>
    </div>
  )
}
