import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Scomponents/Perfil.css';
import CallsUsuarias from '../services/CallsUsuarias';
// Importación de componentes segmentados para mayor claridad y reutilización
import PerfilImagen from './PerfilImagen';
import PerfilAcciones from './PerfilAcciones';
import PerfilEditableItem from './PerfilEditableItem';

/**
 * Componente de perfil de la usuaria.
 * Muestra la información del perfil de la usuaria autenticada.
 * Utiliza componentes segmentados para los campos editables, la imagen y las acciones.
 */
export default function Perfil() {
  const [usuaria, setUsuaria] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    async function fetchUsuaria() {
      const usernameGuardado = localStorage.getItem('usuario');
      if (!usernameGuardado) {
        setError('No se encontró información de inicio de sesión.');
        setLoading(false);
        return;
      }

      try {
        const data = await CallsUsuarias.GetUsuarias();
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

  // Maneja la eliminación del perfil de la usuaria
  const handleEliminar = async () => {
    if (!usuaria) return;

    const confirm = await Swal.fire({
      title: '¿Estás segura?',
      text: 'Esta acción eliminará tu perfil de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await CallsUsuarias.DeleteUsuarias(usuaria.id);
        localStorage.clear(); 
        navigate('/');
      } catch (err) {
        setError('Error al eliminar el perfil.');
      }
    }
  };

  // Maneja el cierre de sesión de la usuaria
  const handleCerrarSesion = async () => {
    const confirm = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión se cerrará y volverás al inicio.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('is_superuser');
      navigate('/');
    }
  };

  if (loading) return <div className="perfil-container">Cargando...</div>;
  if (error) return <div className="perfil-container perfil-error">{error}</div>;
  if (!usuaria) return null;

  return (
    <div className="perfil-container">
      <h1 className="perfil-nombre">{usuaria.username}</h1>

      {/* Imagen de perfil segmentada en su propio componente */}
      <PerfilImagen
        src={usuaria.imagen_url || "../public/Screenshot_2025-05-22_082701-removebg-preview.png"}
        alt="Foto de perfil"
      />

      <ul className="perfil-lista">
        {/* Campos editables segmentados en su propio componente */}
        <PerfilEditableItem label="Nombre" value={usuaria.username || 'Sin nombre'} field="username" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Teléfono" value={usuaria.telefono} field="telefono" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Email" value={usuaria.email} field="email" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Fecha de nacimiento" value={usuaria.fecha_nacimiento} field="fecha_nacimiento" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Intereses" value={usuaria.intereses} field="intereses" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Ubicación" value={usuaria.ubicacion} field="ubicacion" onSave={setUsuaria} usuaria={usuaria} />
        <PerfilEditableItem label="Aportaciones" value={usuaria.aportaciones} field="aportaciones" onSave={setUsuaria} usuaria={usuaria} />

        {/* Acciones segmentadas en su propio componente */}
        <PerfilAcciones onCerrarSesion={handleCerrarSesion} onEliminar={handleEliminar} />
      </ul>
    </div>
  );
}
