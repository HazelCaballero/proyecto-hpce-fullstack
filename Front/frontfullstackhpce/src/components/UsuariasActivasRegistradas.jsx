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

  const activas = usuarias.filter(u => u.is_active=== true);
  console.log("Cantidad de usuarias activas:", activas);
  const activasCount = activas.length;
  const inactivas = usuarias.length - activasCount;
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
              <td>{activasCount}</td>
            </tr>
            <tr>
              <td>Registradas</td>
              <td>{usuarias.length}</td>
            </tr>
            <tr>
              <td>Inactivas</td>
              <td>{inactivas}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
