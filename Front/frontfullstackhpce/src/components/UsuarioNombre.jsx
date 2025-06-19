import React, { useEffect, useState } from 'react';
import '../styles/Scomponents/UsuarioNombre.css';
import CallsUsuarias from '../services/CallsUsuarias';

// Componente para mostrar el nombre de la usuaria por ID
export default function UsuarioNombre({ usuarioId }) {
  const [nombre, setNombre] = useState('Cargando...');
  useEffect(() => {
    let activo = true;
    CallsUsuarias.GetUsuaria(usuarioId)
      .then(usuario => {
        if (activo) setNombre(usuario.nombre || usuario.username || usuario.email || usuarioId);
      })
      .catch(() => {
        if (activo) setNombre(usuarioId);
      });
    return () => { activo = false; };
  }, [usuarioId]);
  return <>{nombre}</>;
}
