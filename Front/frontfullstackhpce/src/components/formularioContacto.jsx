import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import CallsContactos from '../services/CallsContactos'
import '../styles/Scomponents/FormularioContacto.css'

/**
 * Componente de formulario de contacto.
 * Permite a la usuaria enviar mensajes y solicitudes de promoción.
 */
export default function FormularioContacto() {
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [interEnPromocionarse, setInterEnPromocionarse] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (usuario) {
      setNombreUsuario(usuario)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !mensaje.trim()) {
      Swal.fire('Error', 'Por favor, completa todos los campos obligatorios.', 'error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Swal.fire('Error', 'Por favor, ingresa un correo válido.', 'error')
      return
    }

    setLoading(true)
    try {
      // Obtener el ID de usuario desde localStorage si existe
      const usuarioId = localStorage.getItem('usuario_id');
      console.log('usuario_id en localStorage:', usuarioId);
      const payload = {
        correo: email,
        mensaje,
        promocionarse: interEnPromocionarse
      };
      if (usuarioId) {
        payload.usuario = Number(usuarioId); // Asegura que sea número
      } else {
        setLoading(false);
        Swal.fire('Error', 'Debes iniciar sesión para enviar el formulario.', 'error');
        return;
      }
      console.log('Payload enviado:', payload);
      await CallsContactos.PostContactos(payload)
      Swal.fire('Enviado', 'Mensaje enviado correctamente.', 'success')
      setEmail('')
      setMensaje('')
      setInterEnPromocionarse(false)
    } catch (err) {
      // Mostrar el mensaje de error del backend si existe
      if (err.backend) {
        // Mostrar todos los errores del backend de forma amigable
        let msg = '';
        if (typeof err.backend === 'object') {
          for (const key in err.backend) {
            if (Array.isArray(err.backend[key])) {
              msg += `${key}: ${err.backend[key].join(', ')}\n`;
            } else {
              msg += `${key}: ${err.backend[key]}\n`;
            }
          }
        } else {
          msg = err.backend;
        }
        Swal.fire('Error', msg, 'error');
      } else {
        Swal.fire('Error', 'Error al enviar el mensaje.\n' + (err.message || ''), 'error')
      }
    }
    setLoading(false)
  }

  return (
    <div className="formulario-contacto-container">
      
      <div className="formulario-contacto-form" onSubmit={handleSubmit}>
        {nombreUsuario && <h3 className="saludo-contacto">¡Hola {nombreUsuario}! esperamos con gusto tu mensaje.</h3>}
        <h2>Formulario de Contacto</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="contacto-input"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Tu correo electrónico"
          required
        />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          className="contacto-input"
          name="mensaje"
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje"
          required
        />

        <div className="contacto-checkbox-row">
          <input
            type="checkbox"
            id="interEnPromocionarse"
            name="interEnPromocionarse"
            checked={interEnPromocionarse}
            onChange={e => setInterEnPromocionarse(e.target.checked)}
          />
          <label htmlFor="interEnPromocionarse" className="formulario-contacto-label">
            Interesada en promocionarse
          </label>
        </div>

        <button
          className="formulario-contacto-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      
    </div>
  )
}
