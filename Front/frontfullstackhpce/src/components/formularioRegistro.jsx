import React, { useState } from 'react'
import Swal from 'sweetalert2'
import CallsUsuarias from '../services/CallsUsuarias'
import '../styles/Scomponents/FormularioRegistro.css' 

/**
 * Componente de formulario de registro de usuaria.
 * Permite registrar una nueva usuaria en la plataforma.
 */
export default function FormularioRegistro() {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [intereses, setIntereses] = useState('')
  const [aportaciones, setAportaciones] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')

  const handleRegister = async () => {
    // Validación rápida en frontend
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !telefono.trim() ||
      !fechaNacimiento.trim() ||
      !intereses.trim() ||
      !aportaciones.trim() ||
      !ubicacion.trim()
    ) {
      Swal.fire('Error', 'Todos los campos excepto la imagen son obligatorios.', 'error')
      return
    }

    try {
      const usuario = {
        username, 
        email,
        password,
        telefono,
        fecha_nacimiento: fechaNacimiento, 
        intereses,
        aportaciones,
        ubicacion,
        imagen_url: imagenUrl 
      }
      await CallsUsuarias.PostUsuarias(usuario)
      Swal.fire('Registrado', 'Usuario registrado con éxito.', 'success')
      
      setUsername('')
      setEmail('')
      setPassword('')
      setTelefono('')
      setFechaNacimiento('')
      setIntereses('')
      setAportaciones('')
      setUbicacion('')
      setImagenUrl('')
    } catch (error) {
      console.error(error)
      // Mostrar mensaje de error del backend si existe
      if (error.response && error.response.data) {
        const errorMsg = typeof error.response.data === 'string'
          ? error.response.data
          : Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')
        Swal.fire('Error', errorMsg, 'error')
      } else {
        Swal.fire('Error', 'Hubo un problema al registrar el usuario.', 'error')
      }
    }
  }

  return (
    <div className="registro-container">
      <h2 className="formulario-titulo">Registro de Usuario</h2> 
      <div className="registro-form">
        <label>Nombre de usuario</label>
        <input
          className="registro-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
          placeholder="Nombre de usuario"
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
        <label>Intereses</label>
        <input
          className="registro-input"
          value={intereses}
          onChange={e => setIntereses(e.target.value)}
          type="text"
          placeholder="Intereses"
        />
        <label>Aportaciones</label>
        <input
          className="registro-input"
          value={aportaciones}
          onChange={e => setAportaciones(e.target.value)}
          type="text"
          placeholder="Aportaciones"
        />
        <label>Ubicación</label>
        <input
          className="registro-input"
          value={ubicacion}
          onChange={e => setUbicacion(e.target.value)}
          type="text"
          placeholder="Ubicación"
        />
        <label>Foto de perfil (opcional)</label>
        <input
          className="registro-input"
          value={imagenUrl}
          onChange={e => setImagenUrl(e.target.value)}
          type="text"
          placeholder="URL de imagen de perfil"
        />
        
      </div><button className="registro-form-button" onClick={handleRegister}>
          Registrar Usuario
        </button>
    </div>
  )
}