import React from 'react';
import '../styles/Scomponents/PerfilAcciones.css';

// Componente para mostrar las acciones del perfil: cerrar sesión 
export default function PerfilAcciones({ onCerrarSesion}) {
  return (
    <>
      {/* Botón para cerrar sesión */}
      <li className="perfil-cerrar-sesion" onClick={onCerrarSesion}>
        <strong>Cerrar sesión</strong>
      </li>
    </>
  );
}
