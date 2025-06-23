import React from 'react';
import '../styles/Scomponents/PublicacionesLista.css';
import UsuarioNombre from './UsuarioNombre';

// Lista de publicaciones con detalles
export default function PublicacionesLista({ publicaciones, onSelect, onEdit, onDelete, isSuperOrMod }) {
  return (
    <div className="publicaciones-table-container">
      <table className="publicaciones-table">
        <thead>
          <tr className="publicaciones-table-header">
            <th>ID</th>
            <th>Título</th>
            <th>Usuario</th>
            <th>Contenido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {publicaciones.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.titulo}</td>
              <td><UsuarioNombre usuarioId={p.usuario} /></td>
              <td>{p.publicacion}</td>
              <td>
                <button type="button" onClick={() => onSelect(p)}> <img className='user-list-icon' src="../public/see-removebg-preview.png" alt="see-icon" /></button>
                {isSuperOrMod && <button type="button" onClick={() => onEdit(p)} style={{marginLeft:8}}><img className='user-list-icon' src="../public/edit-removebg-preview.png" alt="edit-icon" /></button>}
                {isSuperOrMod && <button type="button" onClick={() => onDelete(p)} style={{marginLeft:8}}><img className='user-list-icon' src="../public/trash-removebg-preview.png" alt="trash-icon" /></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
