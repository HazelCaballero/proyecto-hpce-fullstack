import React, { useState } from 'react';
import '../../styles/Scomponents/AnuncioForm.css';

// Formulario para crear un anuncio
export default function AnuncioForm({ form, onChange, onSubmit }) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.producto || !form.contenido || !form.precio) {
      setError('Todos los campos excepto imagen son obligatorios');
      return;
    }
    setError('');
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="anuncio-form">
      {/* Campos del formulario */}
      <input id="producto" value={form.producto} onChange={onChange} placeholder="Producto" required />
      <input id="contenido" value={form.contenido} onChange={onChange} placeholder="Contenido" required />
      <input id="precio" value={form.precio} onChange={onChange} placeholder="Precio" required />
      <input id="imagen" value={form.imagen} onChange={onChange} placeholder="Imagen (opcional)" />
      {error && <span className="anuncio-form-error">{error}</span>}
      <button type="submit">Crear anuncio</button>
    </form>
  );
}
