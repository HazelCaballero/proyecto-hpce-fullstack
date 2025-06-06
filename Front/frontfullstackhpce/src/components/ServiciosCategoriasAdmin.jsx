import React from 'react';
import ServiciosAdmin from './ServiciosAdmin';
import CategoriasAdmin from './CategoriasAdmin';

export default function ServiciosCategoriasAdmin() {
  return (
    <div className="servicios-categorias-admin">
      <div style={{display:'flex',gap:40,flexWrap:'wrap'}}>
        <ServiciosAdmin />
        <CategoriasAdmin />
      </div>
    </div>
  );
}
