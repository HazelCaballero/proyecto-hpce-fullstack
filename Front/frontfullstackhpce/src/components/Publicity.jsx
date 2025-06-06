import React, { useState } from 'react';
import CallsPublicidades from '../services/CallsPublicidades';

export default function Publicity({ onCreated }) {
  const [form, setForm] = useState({
    producto: '',
    contenido: '',
    precio: '',
    imagen: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.id.toLowerCase()]: e.target.value });
  };

  const handleCrearAnuncio = async () => {
    setLoading(true);
    try {
      await CallsPublicidades.PostPublicidad(form);
      setForm({ producto: '', contenido: '', precio: '', imagen: '' });
      if (onCreated) onCreated();
    } catch (error) {
      alert('Error al crear el anuncio');
    }
    setLoading(false);
  };

  return (
    <div className="form-anuncio">
      <h3>Postear anuncio</h3>
      <div>
        <label htmlFor="Producto">Producto</label>
        <input
          type="text"
          id="Producto"
          placeholder="Producto"
          value={form.producto}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Contenido">Contenido</label>
        <input
          type="text"
          id="Contenido"
          placeholder="Contenido"
          value={form.contenido}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Precio">Precio</label>
        <input
          type="text"
          id="Precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        /> <br />
        <label htmlFor="Imagen">Imagen</label>
        <input
          type="text"
          id="Imagen"
          placeholder="Imagen"
          value={form.imagen}
          onChange={handleChange}
        /> <br />
        <button onClick={handleCrearAnuncio} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Anuncio'}
        </button>
      </div>
    </div>
  );
}
