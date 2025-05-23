import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Scomponents/AsideUsuarias.css' // Importa el CSS

export default function AsideUsuarias() {
  return (
    <div className="aside-usuarias">

      <div className="aside-logo">
        <img src="../public/Screenshot_2025-05-22_082701-removebg-preview.png" alt="LogoConexCreat" />
      </div>

      <div className="aside-menu">
        <ul>
            <li><Link to="/UserMuro">Muro</Link></li>
            <li><Link to="/UserHogar">Hogar</Link></li>
            <li><Link to="/UserPerfil">Perfil</Link></li>
            <li><Link to="/UserInicio">Inicio</Link></li>
            <li><Link to="/UserMercado">Mercado</Link></li>
         </ul>   
      </div>

    </div>
  )
}
