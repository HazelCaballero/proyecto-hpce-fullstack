import React, { useEffect, useState } from 'react';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';
import '../styles/Scomponents/ServiciosAdmin.css';

/**
 * Componente de administración de servicios.
 * Permite ver, crear, editar y eliminar servicios.
 */
export default function ServiciosAdmin({ servicios, setServicios }) {
  const [servForm, setServForm] = useState({
    producto: '',
    contenido: '',
    precio_producto: '',
    monto_pagado: '',
    precio_publicidad: 250,
    dias_anuncio: ''
  });
  const [editServId, setEditServId] = useState(null);



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



  const handleServSubmit = async () => {
    try {
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      const dataToSend = {
        ...servForm,
        usuario: usuarioId
      };
      if (editServId) {
        const actualizado = await CallsServicios.UpdateServicios(editServId, dataToSend);
        setServicios(prev => prev.map(s => s.id === editServId ? { ...s, ...(actualizado || dataToSend) } : s));
        Swal.fire('Actualizado', 'El servicio ha sido actualizado.', 'success');
      } else {
        const nuevoServicio = await CallsServicios.PostServicios(dataToSend);
        if (nuevoServicio && nuevoServicio.id) {
          setServicios(prev => [nuevoServicio, ...prev]);
          Swal.fire('Creado', 'El servicio ha sido creado con éxito.', 'success');
        } else {
          // fallback: recargar todo si la API no devuelve el objeto
          const data = await CallsServicios.GetServicios();
          setServicios(Array.isArray(data) ? data : []);
        }
      }
      setServForm({
        producto: '',
        contenido: '',
        precio_producto: '',
        monto_pagado: '',
        precio_publicidad: 250,
        dias_anuncio: ''
      });
      setEditServId(null);
    } catch (e) {
      Swal.fire('Error', 'No se pudo crear o actualizar el servicio.', 'error');
    }
  };

  const handleServEdit = async (s) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar servicio',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Producto" value="${s.producto || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Contenido" value="${s.contenido || ''}">` +
        `<input id="swal-input3" class="swal2-input" type="number" placeholder="Precio del producto" value="${s.precio_producto || ''}">` +
        `<input id="swal-input4" class="swal2-input" type="number" placeholder="Monto pagado por publicidad" value="${s.monto_pagado || ''}">` +
        `<input id="swal-input5" class="swal2-input" type="number" placeholder="Días de anuncio" value="${s.dias_anuncio || ''}">` +
        `<input id="swal-input6" class="swal2-input" type="number" placeholder="Precio de la publicidad" value="${s.precio_publicidad || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value,
          document.getElementById('swal-input6').value
        ];
      }
    });
    if (formValues) {
      const [producto, contenido, precio_producto, monto_pagado, dias_anuncio, precio_publicidad] = formValues;
      if (!producto.trim() || !contenido.trim() || !precio_producto || !monto_pagado || !dias_anuncio || !precio_publicidad) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
        return;
      }
      try {
        const usuarioId = Number(localStorage.getItem('usuario_id'));
        const dataToSend = {
          producto,
          contenido,
          precio_producto: Number(precio_producto),
          monto_pagado: Number(monto_pagado),
          dias_anuncio: Number(dias_anuncio),
          precio_publicidad: Number(precio_publicidad),
          usuario: usuarioId
        };
        const actualizado = await CallsServicios.UpdateServicios(s.id, dataToSend);
        Swal.fire('Actualizado', 'El servicio ha sido actualizado.', 'success');
        setServicios(prev => prev.map(serv => serv.id === s.id ? { ...serv, ...(actualizado || dataToSend) } : serv));
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error');
      }
    }
  };

  const handleServDelete = async id => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el servicio de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await CallsServicios.DeleteServicios(id);
      Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
      setServicios(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
    }
  };

  const handleCancel = () => {
    setEditServId(null);
    setServForm({
      producto: '',
      contenido: '',
      precio_producto: '',
      monto_pagado: '',
      precio_publicidad: 250,
      dias_anuncio: ''
    });
  };

  return (
    <div className="servicios-admin-container">
      <form className="servicios-form" onSubmit={e => { e.preventDefault(); handleServSubmit(); }}>
        
        <div className="servicios-form-group">
            <label  htmlFor="precio_publicidad"><span className='ser-title'>Precio publicidad por día (fijo)</span></label> 
          <input
            name="precio_publicidad"
            id="precio_publicidad"
            type="number"
            value={servForm.precio_publicidad}
            readOnly
            placeholder="Precio de la publicidad (fijo)"
          />
        </div> 
        <div className="servicios-form-group">
          {/* <label htmlFor="producto">Producto</label> */}
          <input
            name="producto"
            id="producto"
            value={servForm.producto}
            onChange={handleServChange}
            placeholder="Producto"
            required
          />
        </div>
        <div className="servicios-form-group">
         {/* <label htmlFor="contenido">Contenido</label> */}
          <input
            name="contenido"
            id="contenido"
            value={servForm.contenido}
            onChange={handleServChange}
            placeholder="Contenido(Descripción)"
            required
          />
        </div>
        <div className="servicios-form-group">
       {/*   <label htmlFor="precio_producto">Precio del producto</label> */}
          <input
            name="precio_producto"
            id="precio_producto"
            type="number"
            value={servForm.precio_producto}
            onChange={handleServChange}
            placeholder="Precio del producto"
            required
          />
        </div>
        <div className="servicios-form-group">
           {/* <label htmlFor="monto_pagado">Monto pagado por publicidad</label> */}
          <input
            name="monto_pagado"
            id="monto_pagado"
            type="number"
            value={servForm.monto_pagado}
            onChange={handleServChange}
            placeholder="Monto pagado por publicidad"
            required
          />
        </div>
        <div className="servicios-form-group">
        {/*    <label htmlFor="dias_anuncio">Días de anuncio (calculado)</label> */}
          <input
            name="dias_anuncio"
            id="dias_anuncio"
            type="number"
            value={servForm.dias_anuncio}
            readOnly
            placeholder="Días de anuncio"
          />
        </div>
        <button type="submit" className="servicios-btn-crear">
          {editServId ? 'Actualizar' : 'Crear'} Servicio
        </button>
        {editServId && (
          <button type="button" onClick={handleCancel} className="servicios-btn-cancel">
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
