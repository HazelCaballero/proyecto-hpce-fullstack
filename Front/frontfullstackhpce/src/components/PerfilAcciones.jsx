import React from 'react';
import '../styles/Scomponents/PerfilAcciones.css';

// Componente para mostrar las acciones del perfil: cerrar sesión y eliminar perfil
export default function PerfilAcciones({ onCerrarSesion, onEliminar }) {
  return (
    <>
      {/* Botón para cerrar sesión */}
      <li className="perfil-cerrar-sesion" onClick={onCerrarSesion}>
        <strong>Cerrar sesión</strong>
      </li>
      {/* Botón para eliminar el perfil */}
      <li className="perfil-eliminar" onClick={onEliminar}>
        Eliminar perfil
      </li>
    </>
  );
}
