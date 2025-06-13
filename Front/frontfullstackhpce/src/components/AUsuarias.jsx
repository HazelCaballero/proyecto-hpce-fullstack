import React, { useEffect, useState } from 'react';
import CallsUsuarias from '../services/CallsUsuarias';
import Swal from 'sweetalert2';
import '../styles/Scomponents/AUsuarias.css';

export default function Usuarias() {
  const [usuarias, setUsuarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalUsuaria, setModalUsuaria] = useState(null);
  const [editUsuaria, setEditUsuaria] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

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
        `<label style='display:block;margin-top:8px;'><input id="swal-input8" type="checkbox" ${usuaria.is_active ? 'checked' : ''}/> Activa</label>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          username: document.getElementById('swal-input1').value,
          email: document.getElementById('swal-input2').value,
          telefono: document.getElementById('swal-input3').value,
          fecha_nacimiento: document.getElementById('swal-input4').value,
          intereses: document.getElementById('swal-input5').value,
          ubicacion: document.getElementById('swal-input6').value,
          aportaciones: document.getElementById('swal-input7').value,
          is_active: document.getElementById('swal-input8').checked
        };
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

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const updated = await CallsUsuarias.UpdateUsuarias(editUsuaria.id, editForm);
      setUsuarias(us => us.map(u => u.id === updated.id ? updated : u));
      setEditUsuaria(null);
    } catch (err) {
      setEditError('Error al actualizar usuaria');
    } finally {
      setEditLoading(false);
    }
  };


  const activas = usuarias.filter(u => u.is_active).length;
  const registradas = usuarias.length;

  return (
    <div className="usuarias-container">
      <h3 className="usuarias-list-title">Lista de usuarias</h3>
      {loading && <div className="usuarias-loading">Cargando...</div>}
      {error && <div className="usuarias-error">{error}</div>}
      {!loading && !error && (
        <table className="usuarias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarias.map(u => (
              <tr key={u.id} className={(u.is_active === true || u.is_active === 1 || u.is_active === "1") ? '' : 'usuaria-inactiva'}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <button className="usuaria-btn usuaria-ver" type="button" onClick={() => setModalUsuaria(u)}>Ver</button>{' '}
                  <button className="usuaria-btn usuaria-editar" type="button" onClick={() => handleEditar(u)}>Editar</button>{' '}
                  <button
                    className="usuaria-btn usuaria-eliminar"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminar(u.id);
                    }}
                  >
                    Eliminar
                  </button>
                  {isSuperuser && (
                    <select
                      value={u.rol || 'usuaria'}
                      onChange={async (e) => {
                        const nuevoRol = e.target.value;
                        try {
                          await CallsUsuarias.AsignarRolUsuaria(u.id, nuevoRol);
                          setUsuarias(prev => prev.map(us => us.id === u.id ? { ...us, rol: nuevoRol } : us));
                          Swal.fire('Rol actualizado', `Rol cambiado a ${nuevoRol}`, 'success');
                        } catch {
                          Swal.fire('Error', 'No se pudo cambiar el rol', 'error');
                        }
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      <option value="usuaria">Usuaria</option>
                      <option value="moderador">Moderador</option>
                      <option value="soporte">Soporte</option>
                      <option value="superusuario">Superusuario</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="usuarias-stats">
        <h2>N de usuarias activas</h2>
        <p className="usuarias-num">{activas}</p>
        <h2>N de usuarias registradas</h2>
        <p className="usuarias-num">{registradas}</p>
      </div>

    
      {modalUsuaria && (
        <div className="usuaria-modal-bg">
          <div className="usuaria-modal">
            <h2>Datos de la usuaria</h2>
            <p><b>ID:</b> {modalUsuaria.id}</p>
            <p><b>Nombre:</b> {modalUsuaria.username}</p>
            <p><b>Email:</b> {modalUsuaria.email}</p>
            <p><b>Teléfono:</b> {modalUsuaria.telefono}</p>
            <p><b>Fecha de nacimiento:</b> {modalUsuaria.fecha_nacimiento}</p>
            <p><b>Intereses:</b> {modalUsuaria.intereses}</p>
            <p><b>Ubicación:</b> {modalUsuaria.ubicacion}</p>
            <p><b>Aportaciones:</b> {modalUsuaria.aportaciones}</p>
            <p><b>Activa:</b> {(modalUsuaria.is_active === true || modalUsuaria.is_active === 1 || modalUsuaria.is_active === "1") ? 'Sí' : 'No'}</p>
            <button className="usuaria-btn usuaria-cerrar" onClick={() => setModalUsuaria(null)}>Cerrar</button>
          </div>
        </div>
      )}

  
      {/* Edición con SweetAlert, no se muestra modal local */}
    </div>
  );
}

function UsuariaModal({ usuaria, setUsuarias, onClose }) {
  const [editMode, setEditMode] = useState(!!usuaria.editMode);
  const [form, setForm] = useState({ ...usuaria });
  const [guardando, setGuardando] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
      const actualizado = { ...form };
      await CallsUsuarias.UpdateUsuarias(usuaria.id, actualizado);
      setUsuarias(us => us.map(u => u.id === usuaria.id ? actualizado : u));
      setEditMode(false);
      onClose();
    } catch (e) {
      Swal.fire('Error', 'Error al guardar', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300, maxWidth: 400 }}>
        <h2>Datos de la usuaria</h2>
        {editMode ? (
          <>
            <label>Nombre:<br/>
              <input name="username" value={form.username} onChange={handleChange} />
            </label><br/>
            <label>Email:<br/>
              <input name="email" value={form.email} onChange={handleChange} />
            </label><br/>
            <label>Teléfono:<br/>
              <input name="telefono" value={form.telefono} onChange={handleChange} />
            </label><br/>
            <label>Fecha de nacimiento:<br/>
              <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />
            </label><br/>
            <label>Intereses:<br/>
              <input name="intereses" value={form.intereses} onChange={handleChange} />
            </label><br/>
            <label>Ubicación:<br/>
              <input name="ubicacion" value={form.ubicacion} onChange={handleChange} />
            </label><br/>
            <label>Aportaciones:<br/>
              <input name="aportaciones" value={form.aportaciones} onChange={handleChange} />
            </label><br/>
            <button onClick={handleSave} disabled={guardando} style={{marginTop:8}}>Guardar</button>
            <button onClick={() => setEditMode(false)} style={{marginLeft:8}}>Cancelar</button>
          </>
        ) : (
          <>
            <p><b>ID:</b> {usuaria.id}</p>
            <p><b>Nombre:</b> {usuaria.username}</p>
            <p><b>Email:</b> {usuaria.email}</p>
            <p><b>Teléfono:</b> {usuaria.telefono}</p>
            <p><b>Fecha de nacimiento:</b> {usuaria.fecha_nacimiento}</p>
            <p><b>Intereses:</b> {usuaria.intereses}</p>
            <p><b>Ubicación:</b> {usuaria.ubicacion}</p>
            <p><b>Aportaciones:</b> {usuaria.aportaciones}</p>
            <p><b>Superusuaria:</b> {usuaria.is_superuser ? 'Sí' : 'No'}</p>
            <p><b>Activa:</b> {usuaria.is_active ? 'Sí' : 'No'}</p>
            <button onClick={() => setEditMode(true)}>Editar</button>
            <button onClick={onClose} style={{marginLeft:8}}>Cerrar</button>
          </>
        )}
      </div>
    </div>
  );
}

