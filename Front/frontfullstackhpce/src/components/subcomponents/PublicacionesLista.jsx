import React from 'react';
import '../../styles/Scomponents/PublicacionesLista.css';
import UsuarioNombre from './UsuarioNombre';

// Lista de publicaciones con detalles
export default function PublicacionesLista({ publicaciones, onSelect }) {
  return (
    <table className="publicaciones-table">
      <thead>
        <tr>
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
              <button type="button" onClick={() => onSelect(p)}>Ver</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
