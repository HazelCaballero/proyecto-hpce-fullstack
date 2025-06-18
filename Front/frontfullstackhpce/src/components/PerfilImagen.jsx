import React from 'react';
import '../styles/Scomponents/PerfilImagen.css';

// Componente para mostrar la imagen de perfil de la usuaria
export default function PerfilImagen({ src, alt }) {
  return (
    <div className="perfil-img-wrapper">
      <img src={src} alt={alt} className="perfil-img" />
    </div>
  );
}
