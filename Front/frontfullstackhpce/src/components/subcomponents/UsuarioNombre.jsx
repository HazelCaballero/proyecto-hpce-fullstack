import React, { useEffect, useState } from 'react';
import '../../styles/Scomponents/UsuarioNombre.css';

// Componente para mostrar el nombre de la usuaria por ID
export default function UsuarioNombre({ usuarioId }) {
  const [nombre, setNombre] = useState('Cargando...');
  useEffect(() => {
    let activo = true;
    // Aquí deberías importar y usar tu servicio para obtener la usuaria
    // Ejemplo: CallsUsuarias.GetUsuaria(usuarioId)
    // Simulación:
    setTimeout(() => {
      if (activo) setNombre('Nombre de ejemplo');
    }, 500);
    return () => { activo = false; };
  }, [usuarioId]);
  return <>{nombre}</>;
}
