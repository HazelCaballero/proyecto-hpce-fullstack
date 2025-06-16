import React, { useState } from 'react'
import Swal from 'sweetalert2'
import CallsAuth from '../services/CallsAuth'
import { useNavigate } from 'react-router-dom'
import "../styles/Scomponents/FormularioInicioSesion.css"

/**
 * Componente de formulario de inicio de sesión.
 * Permite a la usuaria autenticarse y guardar los tokens en localStorage.
 */
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
      console.log(data);

      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('usuario', username)
      localStorage.setItem('is_superuser', data.is_superuser)

      // extraer y guardar el id del usuario desde el token jwt
      if (data.access) {
        const payload = JSON.parse(atob(data.access.split('.')[1]))
        if (payload.user_id) {
          localStorage.setItem('usuario_id', payload.user_id)
        }
      }

      Swal.fire('Bienvenida', 'Inicio de sesión exitoso.', 'success')
      if (data.is_superuser) {
        navigate('/AdminUsuarias')  // ruta para admin
      } else {
        navigate('/UserPerfil')     // ruta para usuaria
      }

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
