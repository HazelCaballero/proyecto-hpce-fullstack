import React from 'react'
import '../styles/Scomponents/Main.css';

/**
 * Componente contenedor principal para el contenido de la página.
 * Renderiza los hijos recibidos por props.
 * @param {React.ReactNode} children - Elementos hijos a mostrar
 */
export default function Main({ children }) {
  return (
    <div className='main-container'>
      {children}
    </div>
  )
}
