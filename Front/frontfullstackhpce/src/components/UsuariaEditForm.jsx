import React from 'react';
import '../styles/Scomponents/UsuariaEditForm.css';

// Formulario para editar usuaria
export default function UsuariaEditForm({ form, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input id="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre" />
      <input id="email" value={form.email} onChange={onChange} placeholder="Email" />
      <button type="submit">Guardar</button>
    </form>
  );
}
