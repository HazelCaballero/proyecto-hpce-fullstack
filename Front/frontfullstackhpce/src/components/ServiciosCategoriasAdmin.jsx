import React from 'react';
import ServiciosAdmin from './ServiciosAdmin';
import CategoriasAdmin from './CategoriasAdmin';

/**
 * Componente contenedor para administración de servicios y categorías.
 * Muestra ambos paneles en un layout flexible.
 */
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
