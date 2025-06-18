import React from 'react';
import Swal from 'sweetalert2';
import CallsUsuarias from '../services/CallsUsuarias';
import '../styles/Scomponents/PerfilEditableItem.css';

// Componente para mostrar y editar un campo específico del perfil de la usuaria
export default function PerfilEditableItem({ label, value, field, onSave, usuaria }) {
  const [editando, setEditando] = React.useState(false);
  const [nuevoValor, setNuevoValor] = React.useState(value);
  const [guardando, setGuardando] = React.useState(false);

  // Inicia la edición del campo
  const handleEdit = () => setEditando(true);
  // Cancela la edición y restaura el valor original
  const handleCancel = () => {
    setEditando(false);
    setNuevoValor(value);
  };
  // Guarda el nuevo valor editado
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
          {/* Campo de entrada para editar el valor */}
          <input
            type={field === 'fecha_nacimiento' ? 'date' : 'text'}
            value={nuevoValor}
            onChange={e => setNuevoValor(e.target.value)}
            className="perfil-edit-input"
          />
          {/* Botón para guardar el cambio */}
          <button onClick={handleSave} disabled={guardando} className="perfil-edit-btn-save">Guardar</button>
          {/* Botón para cancelar la edición */}
          <button onClick={handleCancel} disabled={guardando}>Cancelar</button>
        </>
      ) : (
        <>
          {/* Muestra el valor y el botón para editar */}
          {value} <button onClick={handleEdit}>Editar</button>
        </>
      )}
    </li>
  );
}
