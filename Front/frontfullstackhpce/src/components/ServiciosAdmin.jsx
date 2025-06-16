import React, { useEffect, useState } from 'react';
import CallsServicios from '../services/CallsServicios';
import Swal from 'sweetalert2';

/**
 * Componente de administración de servicios.
 * Permite ver, crear, editar y eliminar servicios.
 */
export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [servForm, setServForm] = useState({
    producto: '',
    contenido: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_servicio: ''
  });
  const [editServId, setEditServId] = useState(null);

  const cargarDatos = () => {
    CallsServicios.GetServicios()
      .then(data => setServicios(Array.isArray(data) ? data : []))
      .catch(() => setServicios([]));
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleServChange = e => {
    const { name, value } = e.target;
    setServForm({
      ...servForm,
      [name]: name === 'precio_servicio' ? Number(value) : value
    });
  };

  const handleServSubmit = async () => {
    try {
      // Recupera el usuario_id directamente del localStorage
      const usuarioId = Number(localStorage.getItem('usuario_id'));
      console.log('Usuario recuperado:', usuarioId);

      const dataToSend = {
        ...servForm,
        usuario: usuarioId
      };
      console.log('Enviando:', dataToSend);

      if (editServId) {
        await CallsServicios.UpdateServicios(editServId, dataToSend);
      } else {
        await CallsServicios.PostServicios(dataToSend);
      }
      setServForm({
        producto: '',
        contenido: '',
        fecha_inicio: '',
        fecha_fin: '',
        precio_servicio: ''
      });
      setEditServId(null);
      cargarDatos();
    } catch (e) {
      // Puedes mostrar un mensaje de error aquí si lo deseas
    }
  };

  // Edición con SweetAlert2
  const handleServEdit = async (s) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar servicio',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Producto" value="${s.producto || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Contenido" value="${s.contenido || ''}">` +
        `<input id="swal-input3" class="swal2-input" type="date" placeholder="Fecha inicio" value="${s.fecha_inicio ? s.fecha_inicio.slice(0,10) : ''}">` +
        `<input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha fin" value="${s.fecha_fin ? s.fecha_fin.slice(0,10) : ''}">` +
        `<input id="swal-input5" class="swal2-input" type="number" placeholder="Precio" value="${s.precio_servicio || ''}">`,
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
          document.getElementById('swal-input5').value
        ];
      }
    });
    if (formValues) {
      const [producto, contenido, fecha_inicio, fecha_fin, precio_servicio] = formValues;
      if (!producto.trim() || !contenido.trim() || !fecha_inicio || !fecha_fin || !precio_servicio) {
        Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
        return;
      }
      try {
        const usuarioId = Number(localStorage.getItem('usuario_id'));
        const dataToSend = {
          producto,
          contenido,
          fecha_inicio,
          fecha_fin,
          precio_servicio: Number(precio_servicio),
          usuario: usuarioId
        };
        await CallsServicios.UpdateServicios(s.id, dataToSend);
        Swal.fire('Actualizado', 'El servicio ha sido actualizado.', 'success');
        cargarDatos();
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
      cargarDatos();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
    }
  };

  const handleCancel = () => {
    setEditServId(null);
    setServForm({
      producto: '',
      contenido: '',
      fecha_inicio: '',
      fecha_fin: '',
      precio_servicio: ''
    });
  };

  return (
    <div>
      <h3>Servicios</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          name="producto"
          value={servForm.producto}
          onChange={handleServChange}
          placeholder="Producto"
          required
        /> <br />
        <input
          name="contenido"
          value={servForm.contenido}
          onChange={handleServChange}
          placeholder="Contenido"
          required
        /> <br />
        <input
          name="fecha_inicio"
          type="date"
          value={servForm.fecha_inicio}
          onChange={handleServChange}
          required
        /> <br />
        <input
          name="fecha_fin"
          type="date"
          value={servForm.fecha_fin}
          onChange={handleServChange}
          required
        /> <br />
        <input
          name="precio_servicio"
          type="number"
          value={servForm.precio_servicio}
          onChange={handleServChange}
          placeholder="Precio"
          required
        /> <br />
        <button onClick={handleServSubmit}>
          {editServId ? 'Actualizar' : 'Crear'} Servicio
        </button>
        {editServId && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        )}
      </div>
      <ul>
        {servicios.length === 0 ? (
          <li>No hay servicios registrados.</li>
        ) : (
          servicios.map(s => (
            <li key={s.id} style={{ marginBottom: 8 }}>
              <strong>{s.producto}</strong>: {s.contenido} <br />
              <span>Inicio: {s.fecha_inicio?.slice(0, 10)} | Fin: {s.fecha_fin?.slice(0, 10)} | Precio: {s.precio_servicio}</span>
              <br />
              <button onClick={() => handleServEdit(s)} style={{ marginRight: 8 }}>Editar</button>
              <button onClick={() => handleServDelete(s.id)}>Eliminar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
