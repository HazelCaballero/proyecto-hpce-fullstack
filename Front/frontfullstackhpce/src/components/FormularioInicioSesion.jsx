import React, { useState } from 'react'
import Swal from 'sweetalert2'
import CallsAuth from '../services/CallsAuth'
import { useNavigate } from 'react-router-dom'
import "../styles/Scomponents/FormularioInicioSesion.css"

export default function FormularioInicioSesion() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error')
      return
    }
    try {
      const data = await CallsAuth.login(username, password)
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('usuario', username)
      Swal.fire('Bienvenida', 'Inicio de sesión exitoso.', 'success')
      navigate('/UserPerfil')
    } catch (error) {
      Swal.fire('Error', 'Credenciales incorrectas o error de servidor.', 'error')
    }
  }

  return (
    <div className="formulario-inicio-sesion-container">
      <h1 className="formulario-titulo">Formulario de Inicio de Sesión</h1>
      <form className="formulario-inicio-sesion-form" onSubmit={handleLogin}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre de usuario"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  )
}

