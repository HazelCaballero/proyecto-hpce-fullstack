import React from 'react'
import '../styles/Scomponents/FormularioRegistro.css' // Importa el CSS

export default function FormularioRegistro() {
  return (
    <div className="registro-container">
        <h1>Registro</h1>
        <form className="registro-form">     
                <label htmlFor="username">Nombre:</label>
                <input type="text" id="username" name="username" placeholder="Nombre de usuario" required />
                
                <label htmlFor="email">Correo:</label>
                <input type="email" id="email" name="email" placeholder="Correo" required />
                
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" required />
                
                <label htmlFor="phone">Teléfono:</label>
                <input type="text" id="phone" name="phone" placeholder="Teléfono" required />
                
                <button type="submit">Registrar</button>
        </form>
    </div>
  )
}




// ejemplo basado en como trabaje en el mini proyecto

/*

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import CallsUsuarias from '../services/CallsUsuarias';

export default function UsuariosByHazelCC() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const data = await CallsUsuarias.GetUsers();
    setUsuarios(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = {
        nombre,
        email,
        password,
        telefono,
        fechaNacimiento,
        direccion,
      };

      await CallsUsuarias.PostUser(usuario);
      Swal.fire('Agregado', 'Usuario registrado con éxito.', 'success');

      setNombre('');
      setEmail('');
      setPassword('');
      setTelefono('');
      setFechaNacimiento('');
      setDireccion('');

      fetchUsuarios();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar el usuario.', 'error');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <h2>Usuarios</h2>
        
          <label>Nombre</label>
          <input 
            className="registro-input"
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            type="text" 
            placeholder="Nombre del usuario" 
          />
          <label>Email</label>
          <input 
            className="registro-input"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            type="email" 
            placeholder="Correo electrónico" 
          />
          <label>Contraseña</label>
          <input 
            className="registro-input"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            type="password" 
            placeholder="Contraseña" 
          />
          <label>Teléfono</label>
          <input 
            className="registro-input"
            value={telefono} 
            onChange={e => setTelefono(e.target.value)} 
            type="text" 
            placeholder="Teléfono" 
          />
          <label>Fecha de Nacimiento</label>
          <input 
            className="registro-input"
            value={fechaNacimiento} 
            onChange={e => setFechaNacimiento(e.target.value)} 
            type="date" 
          />
          <label>Dirección</label>
          <input 
            className="registro-input"
            value={direccion} 
            onChange={e => setDireccion(e.target.value)} 
            type="text" 
            placeholder="Dirección" 
          />
          <button className="registro-form-button" type="submit">Agregar Usuario</button>
      </div>
    </div>
  );
}


*/