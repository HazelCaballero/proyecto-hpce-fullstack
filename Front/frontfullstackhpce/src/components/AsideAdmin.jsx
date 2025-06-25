import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Scomponents/AsideAdmin.css';

/**
 * Componente de menú lateral para administración.
 * Incluye enlaces de navegación a las páginas de administración.
 */
function AsideAdmin() {
  return (
    <aside className="aside-admin">
      
      <div className="aside-admin__logo-container">
        <img
          className="aside-admin__logo"
          src="../public/Screenshot_2025-05-22_082701-removebg-preview.png"
          alt="LogoConexCreat"
        />
      </div>

        <ul className="aside-admin__nav-list">
          <li className="aside-admin__nav-item">
            <Link to="/AdminUsuarias">Usuarias</Link>
          </li>
          <li className="aside-admin__nav-item">
            <Link to="/AdminTrueques">Trueques</Link>
          </li>
          <li className="aside-admin__nav-item">
            <Link to="/AdminPublicaciones">Publicaciones</Link>
          </li>
          <li className="aside-admin__nav-item">
            <Link to="/AdminContactos">Contactos</Link>
          </li>
          <li className="aside-admin__nav-item">
            <Link to="/AdminPublicidad">Publicidad</Link>
          </li>
        </ul>
        
    </aside>
  )
}

export default AsideAdmin
