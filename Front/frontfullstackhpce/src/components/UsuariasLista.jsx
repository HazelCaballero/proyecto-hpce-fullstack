import React from 'react';
import '../styles/Scomponents/UsuariasLista.css';

// Lista de usuarias en formato tabla
export default function UsuariasLista({ usuarias, onSelect, onEdit }) {
  return (
    <div className="ausuarias-bloque-tabla">
      <div className="usuarias-tbody-container">
        <table className="usuarias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody >
            {usuarias.map(u => (
              <tr key={u.id} className={(u.is_active === true || u.is_active === 1 || u.is_active === "1") ? 'usuaria-activa' : 'usuaria-inactiva'}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>
                  <button className='usua-lis-btn' type="button" onClick={() => onSelect(u)}> <img className='user-list-icon' src="../public/see-removebg-preview.png" alt="see-icon" /> </button>
                  <button className='usua-lis-btn' type="button" onClick={() => onEdit(u)}> <img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /> </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
