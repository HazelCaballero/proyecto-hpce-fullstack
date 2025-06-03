import React, { useEffect, useState } from 'react';
import '../styles/Scomponents/Perfil.css';
import { GetUsuarias, DeleteUsuarias } from '../services/CallsUsuarias';

export default function Perfil() {
  const [usuaria, setUsuaria] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuaria() {
      const usernameGuardado = localStorage.getItem('usuario');
      if (!usernameGuardado) {
        setError('No se encontró información de inicio de sesión.');
        setLoading(false);
        return;
      }

      try {
        const data = await GetUsuarias();
        const usuariaEncontrada = data.find(u => u.username === usernameGuardado);

        if (usuariaEncontrada) {
          setUsuaria(usuariaEncontrada);
        } else {
          setError(`No se encontró el perfil de la usuaria "${usernameGuardado}".`);
        }
      } catch (err) {
        setError('Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsuaria();
  }, []);





  
  return (
    <div className="perfil-container">
      <h1 className="perfil-nombre">{usuaria.username}</h1>

      <div className="perfil-img-wrapper">
        <img
          src={usuaria.imagen_url || "../public/Screenshot_2025-05-22_082701-removebg-preview.png"}
          alt="Foto de perfil"
          className="perfil-img"
        />
      </div>

      <ul className="perfil-lista">
        <li><strong>Nombre:</strong> {usuaria.first_name || 'Sin nombre'}</li>
        <li><strong>Teléfono:</strong> {usuaria.telefono}</li>
        <li><strong>Email:</strong> {usuaria.email}</li>
        <li><strong>Fecha de nacimiento:</strong> {usuaria.fecha_nacimiento}</li>
        <li><strong>Intereses:</strong> {usuaria.intereses}</li>
        <li><strong>Ubicación:</strong> {usuaria.ubicacion}</li>
        <li><strong>Aportaciones:</strong> {usuaria.aportaciones}</li>
        <li className="perfil-eliminar" onClick={handleEliminar}>🗑️ Eliminar perfil</li>
      </ul>
    </div>
  );
}
