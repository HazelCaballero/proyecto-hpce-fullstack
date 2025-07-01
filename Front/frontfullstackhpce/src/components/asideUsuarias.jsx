import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Scomponents/AsideUsuarias.css' 

/**
 * Componente de menú lateral para usuarias.
 * Incluye enlaces de navegación a las páginas principales del usuario.
 */
export default function AsideUsuarias() {
  return (
    <div className="aside-usuarias">

      <div className="aside-usuarias__logo-container">
        <img
          className="aside-usuarias__logo"
          src="../public/Screenshot_2025-05-22_082701-removebg-preview.png"
          alt="LogoConexCreat"
        />
      </div>

      <ul className="aside-usuarias__nav-list">
        <li className="aside-usuarias__nav-item">
          <Link to="/UserMuro">Muro</Link>
        </li>
        <li className="aside-usuarias__nav-item">
          <Link to="/UserHogar">Hogar</Link>
        </li>
        <li className="aside-usuarias__nav-item">
          <Link to="/UserPerfil">Perfil</Link>
        </li>
        <li className="aside-usuarias__nav-item">
          <Link to="/UserInicio">Inicio</Link>
        </li>
        <li className="aside-usuarias__nav-item">
          <Link to="/UserMercado">Mercado</Link>
        </li>
        <li className="aside-usuarias__nav-item">
          <Link to="/UserDonacion" >Donación</Link>
        </li>
      </ul>

    </div>
  )
}