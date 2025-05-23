import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Scomponents/Footer.css'

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      <button
        className="contact-btn"
        onClick={() => navigate('/UserContactanos')}
      >
        Contáctanos
      </button>
      <div className="footer-info">
        <ul>
          <li><strong>Teléfono:</strong> 83031497</li>
          <li><strong>Correo:</strong> hazelcaballeroelizondo@gmail.com</li>
          <li><strong>Instagram</strong></li>
        </ul>
      </div>
    </footer>
  )
}
