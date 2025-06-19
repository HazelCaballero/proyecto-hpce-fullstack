import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Scomponents/Footer.css'

/**
 * Componente de pie de página.
 * Muestra información de contacto y un botón para ir a la página de contacto.
 */
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
          <li><strong>Teléfono:</strong > 83031497</li>
          <li><strong>Correo:</strong> hazelcaballeroelizondo@gmail.com</li>
          <li>
            <strong>
              <a
                href="https://www.instagram.com/imagenes_coloresypalabras/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <img className='insta-icon' src="../public/insta-icon.png" alt="insta-icon" />
              </a>
            </strong>
          </li>
        </ul>
      </div>
    </footer>
  )
}

