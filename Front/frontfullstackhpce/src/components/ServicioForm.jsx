import React, { useState } from 'react';
import Swal from 'sweetalert2';
import CallsServicios from '../services/CallsServicios';
import '../styles/Scomponents/ServiciosAdmin.css';

export default function ServicioForm({ onServicioCreado }) {
  const [servForm, setServForm] = useState({
    producto: '',
    contenido: '',
    precio_producto: '',
    monto_pagado: '',
    precio_publicidad: 250,
    dias_anuncio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleServChange = e => {
    const { name, value } = e.target;
    let newForm = { ...servForm, [name]: value };
    if (name === 'monto_pagado') {
      const monto = parseFloat(value);
      if (monto > 0) {
        newForm.dias_anuncio = Math.floor(monto / 250);
      } else {
        newForm.dias_anuncio = '';
      }
    }
    setServForm(newForm);
  };

  const handleServSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      const dataToSend = {
        ...servForm,
        usuario: usuarioId
      };
      await CallsServicios.PostServicios(dataToSend);
      setServForm({
        producto: '',
        contenido: '',
        precio_producto: '',
        monto_pagado: '',
        precio_publicidad: 250,
        dias_anuncio: ''
      });
      if (onServicioCreado) onServicioCreado();
      Swal.fire('Éxito', 'Servicio creado correctamente', 'success');
    } catch (e) {
      Swal.fire('Error', 'No se pudo crear el servicio', 'error');
    }
    setLoading(false);
  };

  return (
    <form className="servicios-form" onSubmit={handleServSubmit}>
      <div className="servicios-form-group">
        <label htmlFor="producto">Producto</label>
        <input name="producto" id="producto" value={servForm.producto} onChange={handleServChange} placeholder="Producto" required />
      </div>
      <div className="servicios-form-group">
        <label htmlFor="contenido">Contenido</label>
        <input name="contenido" id="contenido" value={servForm.contenido} onChange={handleServChange} placeholder="Contenido" required />
      </div>
      <div className="servicios-form-group">
        <label htmlFor="precio_producto">Precio del producto</label>
        <input name="precio_producto" id="precio_producto" type="number" value={servForm.precio_producto} onChange={handleServChange} placeholder="Precio del producto" required />
      </div>
      <div className="servicios-form-group">
        <label htmlFor="monto_pagado">Monto pagado por publicidad</label>
        <input name="monto_pagado" id="monto_pagado" type="number" value={servForm.monto_pagado} onChange={handleServChange} placeholder="Monto pagado" required />
      </div>
      <div className="servicios-form-group">
        <label htmlFor="precio_publicidad">Precio de la publicidad</label>
        <input name="precio_publicidad" id="precio_publicidad" type="number" value={servForm.precio_publicidad} onChange={handleServChange} placeholder="Precio de la publicidad" required />
      </div>
      <div className="servicios-form-group">
        <label htmlFor="dias_anuncio">Días de anuncio</label>
        <input name="dias_anuncio" id="dias_anuncio" type="number" value={servForm.dias_anuncio} readOnly placeholder="Días de anuncio" />
      </div>
      <button type="submit" className="servicios-btn-crear" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Servicio'}
      </button>
    </form>
  );
}
