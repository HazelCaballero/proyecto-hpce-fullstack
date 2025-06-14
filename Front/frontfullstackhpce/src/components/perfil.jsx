import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Scomponents/Perfil.css';
import CallsUsuarias from '../services/CallsUsuarias';

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

      <div className="perfil-img-wrapper">
        <img
          src={usuaria.imagen_url || "../public/Screenshot_2025-05-22_082701-removebg-preview.png"}
          alt="Foto de perfil"
          className="perfil-img"
        />
      </div>

      <ul className="perfil-lista">
        <EditableItem label="Nombre" value={usuaria.username || 'Sin nombre'} field="username" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Teléfono" value={usuaria.telefono} field="telefono" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Email" value={usuaria.email} field="email" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Fecha de nacimiento" value={usuaria.fecha_nacimiento} field="fecha_nacimiento" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Intereses" value={usuaria.intereses} field="intereses" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Ubicación" value={usuaria.ubicacion} field="ubicacion" onSave={setUsuaria} usuaria={usuaria} />
        <EditableItem label="Aportaciones" value={usuaria.aportaciones} field="aportaciones" onSave={setUsuaria} usuaria={usuaria} />

        <li className="perfil-cerrar-sesion" onClick={handleCerrarSesion}>
          <strong>Cerrar sesión</strong>
        </li>
        <li className="perfil-eliminar" onClick={handleEliminar}>
          Eliminar perfil
        </li>
      </ul>
    </div>
  );
}


function EditableItem({ label, value, field, onSave, usuaria }) {
  const [editando, setEditando] = React.useState(false);
  const [nuevoValor, setNuevoValor] = React.useState(value);
  const [guardando, setGuardando] = React.useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setNuevoValor(value);
  };
  const handleSave = async () => {
    setGuardando(true);
    try {
      const actualizado = { ...usuaria, [field]: nuevoValor };
      await CallsUsuarias.UpdateUsuarias(usuaria.id, actualizado);
      onSave(actualizado);
      setEditando(false);
    } catch (e) {
      Swal.fire('Error', 'Error al guardar', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <li>
      <strong>{label}:</strong>{' '}
      {editando ? (
        <>
          <input
            type={field === 'fecha_nacimiento' ? 'date' : 'text'}
            value={nuevoValor}
            onChange={e => setNuevoValor(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleSave} disabled={guardando} style={{ marginRight: 4 }}>Guardar</button>
          <button onClick={handleCancel} disabled={guardando}>Cancelar</button>
        </>
      ) : (
        <>
          {value} <button onClick={handleEdit}>Editar</button>
        </>
      )}
    </li>
  );
}
