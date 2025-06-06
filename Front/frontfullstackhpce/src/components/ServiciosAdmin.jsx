import React, { useEffect, useState } from 'react';
import CallsServicios from '../services/CallsServicios';

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [servForm, setServForm] = useState({ nombre: '', descripcion: '' });
  const [editServId, setEditServId] = useState(null);

  const cargarDatos = () => {
    CallsServicios.GetServicios().then(setServicios).catch(() => setServicios([]));
  };
  useEffect(() => { cargarDatos(); }, []);

  const handleServChange = e => setServForm({ ...servForm, [e.target.name]: e.target.value });
  const handleServSubmit = async e => {
    e.preventDefault();
    if (editServId) {
      await CallsServicios.UpdateServicios(editServId, servForm);
    } else {
      await CallsServicios.PostServicios(servForm);
    }
    setServForm({ nombre: '', descripcion: '' });
    setEditServId(null);
    cargarDatos();
  };
  const handleServEdit = s => { setServForm(s); setEditServId(s.id); };
  const handleServDelete = async id => { if(window.confirm('¿Eliminar servicio?')) { await CallsServicios.DeleteServicios(id); cargarDatos(); } };

  return (
    <div>
      <h3>Servicios</h3>
      <form onSubmit={handleServSubmit} style={{marginBottom:12}}>
        <input name="nombre" value={servForm.nombre} onChange={handleServChange} placeholder="Nombre" required /> <br />
        <input name="descripcion" value={servForm.descripcion} onChange={handleServChange} placeholder="Descripción" required /> <br />
        <button type="submit">{editServId ? 'Actualizar' : 'Crear'} Servicio</button>
        {editServId && <button type="button" onClick={()=>{setEditServId(null);setServForm({nombre:'',descripcion:''})}}>Cancelar</button>}
      </form>
      <ul>
        {servicios.map(s => (
          <li key={s.id}>
            {s.nombre}: {s.descripcion}
            <button onClick={()=>handleServEdit(s)} style={{marginLeft:8}}>Editar</button>
            <button onClick={()=>handleServDelete(s.id)} style={{marginLeft:4}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
