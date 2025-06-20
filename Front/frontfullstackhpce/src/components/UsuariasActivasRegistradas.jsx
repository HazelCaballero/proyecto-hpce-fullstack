import React from 'react';
import '../styles/Scomponents/UsuariasActivasRegistradas.css';

// Componente para mostrar resumen de usuarias activas y registradas
export default function UsuariasActivasRegistradas({ usuarias }) {
  if (!usuarias || usuarias.length === 0) {
    return (
      <div className="usuarias-activas-bloque-tabla">
        <h3>No hay usuarias registradas.</h3>
      </div>
    );
  }

  const activas = usuarias.filter(u => u.is_active === true || u.is_active === 1 || u.is_active === "1");
  const inactivas = usuarias.length - activas.length;

  return (
    <div className="usuarias-activas-bloque-tabla">
      <div className="usuarias-activas-tbody-container">
        <table className="usuarias-activas-table">
          <thead>
            <tr>
              <th>Usuarias</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Activas</td>
              <td>{activas.length}</td>
            </tr>
            <tr>
              <td>Registradas</td>
              <td>{usuarias.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
