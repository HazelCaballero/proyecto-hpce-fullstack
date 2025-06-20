import React, { useEffect, useState } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import Swal from 'sweetalert2';
import '../styles/Scomponents/AUsuarias.css';
import UsuariasLista from './UsuariasLista';
import UsuariaModal from './UsuariaModal';
import UsuariasActivasRegistradas from './UsuariasActivasRegistradas';

/**
 * Componente de administración de usuarias.
 * Permite ver, editar, eliminar y mostrar detalles de usuarias.
 */
export default function Usuarias() {
  const [usuarias, setUsuarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalUsuaria, setModalUsuaria] = useState(null);

  const isSuperuser = localStorage.getItem('is_superuser') === 'true';
  const rol = localStorage.getItem('rol');
  const isSoporte = rol === 'soporte';

  useEffect(() => {
    async function fetchUsuarias() {
      try {
        const data = await CallsUsuarias.GetUsuarias();
        setUsuarias(data);
      } catch (err) {
        setError('Error al cargar usuarias');
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarias();
  }, []);

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás segura?',
      text: 'Esta acción desactivará a la usuaria.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await CallsUsuarias.DeleteUsuarias(id);
      setUsuarias(usuarias => usuarias.map(u => u.id === id ? { ...u, is_active: false } : u));
      Swal.fire('Eliminada', 'La usuaria ha sido desactivada.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Error al eliminar usuaria', 'error');
    }
  };

  const handleEditar = async (usuaria) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar usuaria',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${usuaria.username || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${usuaria.email || ''}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Teléfono" value="${usuaria.telefono || ''}">` +
        `<input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha de nacimiento" value="${usuaria.fecha_nacimiento || ''}">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Intereses" value="${usuaria.intereses || ''}">` +
        `<input id="swal-input6" class="swal2-input" placeholder="Ubicación" value="${usuaria.ubicacion || ''}">` +
        `<input id="swal-input7" class="swal2-input" placeholder="Aportaciones" value="${usuaria.aportaciones || ''}">` +
        (isSuperuser ?
          `<select id="swal-input9" class="swal2-input">
            <option value="usuaria" ${usuaria.rol === 'usuaria' ? 'selected' : ''}>Usuaria</option>
            <option value="moderador" ${usuaria.rol === 'moderador' ? 'selected' : ''}>Moderador</option>
            <option value="soporte" ${usuaria.rol === 'soporte' ? 'selected' : ''}>Soporte</option>
            <option value="superusuario" ${usuaria.rol === 'superusuario' ? 'selected' : ''}>Superusuario</option>
          </select>` :
          ''
        ) +
        `<div class='ausuarias-margin-top-8'><b>Estado:</b> ${usuaria.is_active ? 'Activa' : 'Inactiva'}</div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const base = {
          username: document.getElementById('swal-input1').value,
          email: document.getElementById('swal-input2').value,
          telefono: document.getElementById('swal-input3').value,
          fecha_nacimiento: document.getElementById('swal-input4').value,
          intereses: document.getElementById('swal-input5').value,
          ubicacion: document.getElementById('swal-input6').value,
          aportaciones: document.getElementById('swal-input7').value
        };
        if (isSuperuser) {
          base.rol = document.getElementById('swal-input9').value;
        }
        return base;
      }
    });
    if (formValues) {
      try {
        await CallsUsuarias.UpdateUsuarias(usuaria.id, formValues);
        setUsuarias(us => us.map(u => u.id === usuaria.id ? { ...u, ...formValues } : u));
        Swal.fire('Actualizado', 'La usuaria ha sido actualizada.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Error al actualizar usuaria', 'error');
      }
    }
  };

  const activas = usuarias.filter(u => u.is_active).length;
  const registradas = usuarias.length;

  return (
    <div className="ausuarias-admin-container">
      <h2 className="ausuarias-titulo">Administración de Usuarias</h2>
      <div className='ausuarias-estadisticas' style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {loading && <div className="ausuarias-loading">Cargando usuarias...</div>}
        {error && <div className="ausuarias-error">{error}</div>}
        {!loading && !error && (
          <>
            <UsuariasLista usuarias={usuarias} onSelect={setModalUsuaria} onEdit={handleEditar} />
            <UsuariasActivasRegistradas usuarias={usuarias} />
          </>
        )}
        {modalUsuaria && (
          <UsuariaModal usuaria={modalUsuaria} onClose={() => setModalUsuaria(null)} />
        )}
      </div>
    </div>
  );
}

