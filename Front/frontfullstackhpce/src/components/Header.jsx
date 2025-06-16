import React from 'react'
import "../styles/Scomponents/Header.css";

/**
 * Componente de encabezado reutilizable.
 * Muestra el título recibido por props.
 * @param {string} titulo - Título a mostrar en el header
 */
export default function HeaderAdmin({titulo=""}) {
  return (
    <div className="header-admin">
        <h1>{titulo}</h1>
    </div>
  )
}

